import { protos, SpeechClient } from "@google-cloud/speech";
import { Storage } from "@google-cloud/storage";
import logger from "../logger/logger";
import { AppError } from "../utils/error";
import { statusCode, TranscriptionResult } from "../types/types";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import { unlink } from "fs/promises";

export class TranscriptionService {
  private static readonly BUCKET_NAME = "youtube-video-summarizer-audio";
  private static readonly speechClient = new SpeechClient();
  private static readonly storage = new Storage();

  static async ensureBucketExists() {
    try {
      const [exists] = await this.storage.bucket(this.BUCKET_NAME).exists();

      if (!exists) {
        await this.storage.createBucket(this.BUCKET_NAME, {
          location: "US",
          storageClass: "STANDARD",
        });
        logger.info(`Bucket ${this.BUCKET_NAME} created`);
      }
    } catch (error) {
      throw new AppError(statusCode.SERVER_ERROR, "Failed to create bucket");
    }
  }

  static async uploadToGCS(filePath: string): Promise<string> {
    const fileName = path.basename(filePath);
    const bucket = this.storage.bucket(this.BUCKET_NAME);

    try {
      await bucket.upload(filePath, {
        destination: fileName,
        metadata: {
          contentType: "audio/wav",
        },
      });

      const gcsUrl = `gs://${this.BUCKET_NAME}/${fileName}`;

      logger.info(`audio uploaded to gcs: ${gcsUrl}`);

      return gcsUrl;
    } catch (error) {
      throw new AppError(statusCode.BAD_REQUEST, "Upload to GCS failed");
    }
  }

  static async deleteFromGCS(gcsUrl: string): Promise<void> {
    try {
      const fileName = gcsUrl.split("/").pop();

      if (!fileName) {
        throw new AppError(statusCode.NOT_FOUND, "File not exists");
      }

      const file = this.storage.bucket(this.BUCKET_NAME).file(fileName);

      const [exists] = await file.exists();

      if (!exists) {
        throw new AppError(statusCode.NOT_FOUND, "File not exists");
      }
      await file.delete();
      logger.info(`Audio deleted from GCS: ${gcsUrl}`);
    } catch (error) {
      throw new AppError(statusCode.BAD_REQUEST, "Delete from GCS failed");
    }
  }

  static async convertToWav(inputPath: string): Promise<string> {
    const outputPath = path.join(
      path.dirname(inputPath),
      `${path.basename(inputPath, path.extname(inputPath))}.wav`
    );

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat("wav")
        .audioFilters([
          "aresample=resampler=soxr",
          "highpass=f=50",
          "lowpass=f=3000",
          "afftdn=nf=-25",
          "loudnorm=I=-16:LRA=11:TP=-1.5",
          "aformat=channel_layouts=mono",
        ])
        .on("end", () => {
          logger.info(`Audio converted to WAV: ${outputPath}`);
          resolve(outputPath);
        })
        .on("error", (err) => {
          logger.error(`Error converting audio to WAV: ${err.message}`);
          reject(
            new AppError(
              statusCode.SERVER_ERROR,
              "Failed to convert audio to wav"
            )
          );
        });
    });
  }

  static async detectContentType(
    audioPath: string
  ): Promise<"speech" | "music"> {
    try {
      const analysisPath = path.join(
        path.dirname(audioPath),
        `${path.basename(audioPath, path.extname(audioPath))}_analysis.wav`
      );

      return new Promise((resolve, reject) => {
        let musicScore = 0;
        let totalSamples = 0;

        ffmpeg(audioPath)
          .toFormat("wav")
          .audioFrequency(16000)
          .audioFilter(["silencedetect=n=-50dB:d=0.5", "volumedetect"])
          .save(analysisPath)
          .on("stderr", (stderrLine: string) => {
            logger.info(`ffmpeg stderr: ${stderrLine}`);
            if (stderrLine.includes("silence_duration")) {
              musicScore -= 1;
            }
            if (stderrLine.includes("max_volume")) {
              const match = stderrLine.match(/max_volume:\s*([-\d.]+)/);

              if (match) {
                const maxVolume = parseFloat(match[1]);
                if (maxVolume > -5) {
                  musicScore + 1;
                }
              }
            }
            totalSamples += 1;
          })
          .on("end", async () => {
            await unlink(analysisPath).catch(() => {});
            const ratio = totalSamples > 0 ? musicScore / totalSamples : 0;
            logger.info(`Music detection ratio: ${ratio}`);
            resolve(ratio > 0.5 ? "music" : "speech");
          })
          .on("error", async (err) => {
            logger.error(`Error detecting content type: ${err.message}`);
            await unlink(analysisPath).catch(() => {});
            reject(
              new AppError(
                statusCode.SERVER_ERROR,
                "Failed to detect content type"
              )
            );
          });
      });
    } catch (error) {
      logger.error(`Error during detecting content type: ${error}`);
      throw new AppError(
        statusCode.SERVER_ERROR,
        "Error occurred during detecting content type"
      );
    }
  }

  static async transcribe(audioPath: string): Promise<TranscriptionResult> {
    let wavPath: string | undefined;
    let gcsUrl: string | undefined;

    try {
      if (!audioPath) {
        throw new AppError(statusCode.BAD_REQUEST, "No audio file provider");
      }

      await this.ensureBucketExists();

      // first convert to wav
      wavPath = await this.convertToWav(audioPath);
      logger.info(`Converted audio to wav: ${wavPath}`);

      //  detect audio is music or speech
      const contentType = await this.detectContentType(wavPath);
      logger.info(`Content type: ${contentType}`);

      if (contentType === "music") {
        await unlink(wavPath).catch(() => {});
        return {
          text: "[MUSIC CONTENT DETECTED]",
          confidence: 1.0,
          isMusic: true,
        };
      }

      gcsUrl = await this.uploadToGCS(wavPath);
      logger.info(`File uploaded to GCS: ${gcsUrl}`);

      const request: protos.google.cloud.speech.v1.ILongRunningRecognizeRequest =
        {
          audio: {
            uri: gcsUrl,
          },
          config: {
            encoding:
              protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding
                .LINEAR16,
            sampleRateHertz: 16000,
            languageCode: "en-US",
            enableAutomaticPunctuation: true,
            model: "default",
            metadata: {
              interactionType: "DICTATION",
              microphoneDistance: "NEARFIELD",
              recordingDeviceType: "SMARTPHONE",
            },
            enableWordTimeOffsets: true,
            enableWordConfidence: true,
            maxAlternatives: 1,
            profanityFilter: true,
            adaptation: {
              phraseSetReferences: [],
              customClasses: [],
            },
            audioChannelCount: 1,
            enableSeparateRecognitionPerChannel: false,
            speechContexts: [
              {
                phrases: ["video", "youtube", "subscribe", "like", "comment"],
                boost: 20,
              },
            ],
          },
        };

      const [operation] = await this.speechClient.longRunningRecognize(request);
      const [response] = await operation.promise();
      logger.info(`Transcription response: ${JSON.stringify(response)}`);

      //  cleanup files
      await Promise.all([
        wavPath ? unlink(wavPath).catch(() => {}) : Promise.resolve(),
        gcsUrl ? this.deleteFromGCS(gcsUrl) : Promise.resolve(),
      ]);

      if (!response.results || response.results.length === 0) {
        throw new AppError(
          statusCode.BAD_REQUEST,
          "No transcription results found"
        );
      }

      const transcription = response.results
        .map((result) => result.alternatives?.[0]?.transcript || "")
        .join(" ");

      const confidence =
        response.results.reduce(
          (sum, result) => sum + (result.alternatives?.[0]?.confidence || 0),
          0
        ) / response.results.length;

      if (!transcription.trim()) {
        throw new AppError(
          statusCode.BAD_REQUEST,
          "No transcription results found"
        );
      }

      return {
        text: transcription,
        confidence: confidence,
        isMusic: false,
      };
    } catch (error) {
      logger.error(`Error while transcribing audio ${error}`);
      throw new AppError(
        statusCode.SERVER_ERROR,
        "Error while transcribing audio"
      );
    }
  }
}

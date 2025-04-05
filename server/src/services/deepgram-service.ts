import { createClient } from "@deepgram/sdk";
import { envConfig } from "../config/env-config";
import { statusCode, TranscriptionResult } from "../types/types";
import { AppError } from "../utils/error";
import { TranscriptionService } from "./transcription-services";
import logger from "../logger/logger";
import { unlink } from "fs/promises";
import fs from "fs";

export class Deepgram {
  private static readonly deepgramClient = createClient(
    envConfig.deepgram.apiKey
  );

  static async transcribe(audioPath: string): Promise<TranscriptionResult> {
    let wavPath: string | undefined;
    console.log("transcribe started");
    try {
      if (!audioPath) {
        throw new AppError(statusCode.BAD_REQUEST, "No audio file provider");
      }

      // first convert to wav
      wavPath = await TranscriptionService.convertToWav(audioPath);
      logger.info(`Converted audio to wav: ${wavPath}`);

      //  detect audio is music or speech
      const contentType = await TranscriptionService.detectContentType(wavPath);
      logger.info(`Content type: ${contentType}`);

      if (contentType === "music") {
        await unlink(wavPath).catch(() => {});
        return {
          text: "[MUSIC CONTENT DETECTED]",
          confidence: 1.0,
          isMusic: true,
        };
      }

      const { result: deepgramResult, error: deepgramErr } =
        await this.deepgramClient.listen.prerecorded.transcribeFile(
          fs.readFileSync(wavPath)
        );

      logger.info(`Transcription response: ${JSON.stringify(deepgramResult)}`);

      if (deepgramErr) {
        throw new AppError(
          statusCode.SERVER_ERROR,
          "Error occurred during deepgram speech to text"
        );
      }

      //  cleanup files
      if (wavPath) {
        try {
          await unlink(wavPath);
        } catch (_) {}
      }

      if (
        !deepgramResult.results ||
        !deepgramResult.results.channels ||
        deepgramResult.results.channels[0].alternatives[0].transcript.length ===
          0
      ) {
        throw new AppError(
          statusCode.BAD_REQUEST,
          "No transcription results found"
        );
      }

      const transcription =
        deepgramResult.results.channels[0].alternatives[0].transcript;

      const confidence =
        deepgramResult.results.channels[0].alternatives[0].confidence;

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
      if (wavPath) {
        try {
          await unlink(wavPath);
        } catch (_) {}
      }
      throw new AppError(
        statusCode.SERVER_ERROR,
        "Error while transcribing audio"
      );
    }
  }
}

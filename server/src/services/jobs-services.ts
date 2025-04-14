import Queue from "bull";
import { AppDataSource } from "../config/db";
import { Video } from "../entities/video-entity";
import { Transcription } from "../entities/transcription-entity";
import { Analysis } from "../entities/analysis-entity";
import { User } from "../entities/user-entity";
import { statusCode, TranscriptionJob, VideoInfo } from "../types/types";
import { VideoService } from "./video-services";
import { unlink } from "fs/promises";
import { GeminiService } from "./gemini-service";
import logger from "../logger/logger";
import { Deepgram } from "./deepgram-service";
import { AppError } from "../utils/error";
import { ApiError } from "@google-cloud/storage";

export class JobService {
  private static transcriptQueue: Queue.Queue;
  private static readonly userRepo = AppDataSource.getRepository(User);
  private static readonly videoRepo = AppDataSource.getRepository(Video);
  private static readonly analysisRepo = AppDataSource.getRepository(Analysis);
  private static readonly transcriptionRepo =
    AppDataSource.getRepository(Transcription);

  static getTranscriptionQueue() {
    return this.transcriptQueue;
  }

  static async initialize() {
    this.transcriptQueue = new Queue<TranscriptionJob>("transcription", {
      redis: {
        host: "localhost",
        port: 6379,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: {
          age: 24 * 3600,
          count: 100,
        },
        removeOnFail: {
          age: 24 * 3600,
        },
      },
    });

    await this.setupQueueHandlers();
  }

  static async setupQueueHandlers() {
    this.transcriptQueue.process(async (job) => {
      const { url, userId } = job.data;
      let audioPath: string | undefined;
      let video: Video | null = null;

      try {
        video = await this.videoRepo.findOne({ where: { url } });

        if (!video) {
          video = new Video();
          video.url = url;
          video.status = "processing";
          video.user = { id: userId } as User;
        }

        job.progress(10);

        const videoInfo =
          job.data.videoInfo || (await VideoService.getVideoInfo(url));

        Object.assign(video, {
          title: videoInfo.title,
          description: videoInfo.description,
          duration: videoInfo.duration,
          author: videoInfo.author,
          thumbnail: videoInfo.thumbnailUrl || videoInfo.thumbnail,
        });

        await this.videoRepo.save(video);
        job.progress(20);

        audioPath = await VideoService.downloadAudio(url);
        job.progress(40);

        const transcriptionResult = await Deepgram.transcribe(audioPath);
        job.progress(55);
        let transcription = await this.transcriptionRepo.findOne({
          where: { video: { id: video.id } },
        });
        if (transcription) {
          transcription.text = transcriptionResult.text;
          transcription.confidence = transcriptionResult.confidence;
          transcription.isMusic = transcriptionResult.isMusic || false;
          transcription.audioPath = audioPath;
          transcription.video = video;
        } else {
          transcription = new Transcription();
          transcription.text = transcriptionResult.text;
          transcription.confidence = transcriptionResult.confidence;
          transcription.isMusic = transcriptionResult.isMusic || false;
          transcription.audioPath = audioPath;
          transcription.video = video;
        }

        await this.transcriptionRepo.save(transcription);

        if (audioPath) {
          await unlink(audioPath).catch(() => {});
        }
        job.progress(70);

        if (transcription.isMusic) {
          video.status = "completed";
          await this.videoRepo.save(video);
          return {
            videoInfo,
            transcription: transcriptionResult,
            status: "completed",
          };
        }

        // ai analysis
        const analysisResult = await GeminiService.analyzeTranscription(
          transcription.text,
          videoInfo
        );

        job.progress(90);

        let analysis = await this.analysisRepo.findOne({
          where: { video: { id: video.id } },
        });

        if (analysis) {
          Object.assign(analysis, analysisResult);
        } else {
          analysis = new Analysis();
          Object.assign(analysis, analysisResult);
          analysis.video = video;
        }

        await this.analysisRepo.save(analysis);

        video.status = "completed";
        await this.videoRepo.save(video);
        job.progress(100);

        return {
          videoInfo,
          transcription: transcriptionResult,
          analysis: analysisResult,
          status: "completed",
        };
      } catch (error) {
        if (audioPath) {
          await unlink(audioPath).catch(console.error);
        }

        if (video) {
          video.status = "failed";
          await this.videoRepo.save(video);
        }

        logger.error("Job processing error: ", error);

        if (
          error instanceof ApiError &&
          (error.message.includes("No speech detected") ||
            error.message.includes("This video is private") ||
            error.message.includes("This video no longer available"))
        ) {
          return {
            error: error.message,
            status: "failed",
            final: true,
          };
        }
        throw error;
      }
    });

    this.transcriptQueue.on("completed", async (job, result) => {
      try {
        const user = await this.userRepo.findOne({
          where: { id: job.data.userId },
        });
        if (user && result.videoInfo) {
          // send email notification after job done
        }
      } catch (error) {
        logger.error(`Error sending job completion mail`);
      }
    });

    this.transcriptQueue.on("failed", async (job, error) => {
      logger.error(`Job ${job.id} failed: ${error}`);
    });

    this.transcriptQueue.on("error", (err) => {
      logger.error(`Transaction queue error: ${err}`);
    });

    this.transcriptQueue.clean(24 * 3600 * 1000, "delayed");
    this.transcriptQueue.clean(24 * 3600 * 1000, "wait");
    this.transcriptQueue.clean(24 * 3600 * 1000, "active");
  }

  static async addTranscriptionJob(url: string, videoInfo?: any, user?: any) {
    let video = await this.videoRepo.findOne({ where: { url } });

    if (!video) {
      video = new Video();
      video.url = url;
      video.status = "pending";
      video.user = user;

      if (videoInfo) {
        Object.assign(video, {
          title: videoInfo.title,
          description: videoInfo.description || null,
          duration: videoInfo.duration,
          author: videoInfo.author,
          thumbnail: videoInfo.thumbnailUrl || videoInfo.thumbnail || null,
        });
      }
      await this.videoRepo.save(video);
    }

    const job = await this.transcriptQueue.add({
      url,
      videoInfo,
      userId: user.id,
    });

    return { jobId: job.id };
  }

  static async getJobStatus(jobId: string) {
    const job = await this.transcriptQueue.getJob(jobId);

    if (!job) {
      throw new AppError(statusCode.NOT_FOUND, "Job not found");
    }

    const state = await job.getState();
    const progress = await job.progress();
    const result = job.returnvalue;
    const failedReason = job.failedReason;
    const attempts = job.attemptsMade;

    let videoStatus = null;
    if (result?.videoInfo?.url) {
      const video = await this.videoRepo.findOne({
        where: { url: result.videoInfo.url },
        relations: ["transcription", "analysis"],
      });
      if (video) {
        videoStatus = {
          id: video.id,
          status: video.status,
          hasTranscription: !!video.transcription,
          hasAnalysis: !!video.analysis,
        };
      }
    }

    return {
      id: job.id,
      state,
      progress,
      result,
      failedReason,
      attempts,
      videoStatus,
      final: result?.final || state === "completed" || attempts >= 3,
    };
  }

  static async getAllJobs(userId: string) {
    const activeJobs = await this.transcriptQueue.getActive();
    const waitingJobs = await this.transcriptQueue.getWaiting();
    const completedJobs = await this.transcriptQueue.getCompleted();
    const delayedJobs = await this.transcriptQueue.getDelayed();
    const failedJobs = await this.transcriptQueue.getFailed();

    const jobs = [
      ...activeJobs,
      ...waitingJobs,
      ...completedJobs,
      ...delayedJobs,
      ...failedJobs,
    ];

    const userJobs = jobs.filter((job) => {
      console.log(job.data.userId);
      return job.data.userId === userId;
    });

    userJobs.sort((a, b) => a.timestamp - b.timestamp);

    const jobDetails = await Promise.all(
      userJobs.map(async (job) => {
        const state = await job.getState();
        const progress = await job.progress();

        return {
          id: job.id,
          state,
          progress,
          data: job.data,
          timestamp: job.timestamp,
          processedOn: job.processedOn,
          finishedOn: job.finishedOn,
          attemptsMade: job.attemptsMade,
          result: job.returnvalue,
          failedReason: job.failedReason ? job.failedReason : null,
          videoStatus: job.data?.url
            ? await this.getVideoStatus(job.data.url)
            : null,
        };
      })
    );

    return jobDetails;
  }

  private static async getVideoStatus(url: string) {
    const video = await this.videoRepo.findOne({
      where: { url: url },
      select: ["id", "status", "title", "thumbnail"],
      relations: ["transcription", "analysis"],
    });

    if (!video) {
      logger.warn(`Video not found for url: ${url}`);
      return null;
    }

    return {
      id: video.id,
      status: video.status,
      hasTranscription: !!video.transcription,
      hasAnalysis: !!video.analysis,
      title: video.title,
      thumbnail: video.thumbnail,
    };
  }
}

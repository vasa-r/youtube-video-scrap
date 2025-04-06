import { NextFunction, Request, Response } from "express";
import { VideoService } from "../services/video-services";
import { JwtPayloadWithUser, statusCode } from "../types/types";
import { successRes } from "../utils/response-format";
import { AuthService } from "../services/auth-services";
import { JobService } from "../services/jobs-services";
import { AppError } from "../utils/error";

export class VideoController {
  static async getVideoInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { url } = req.body;

      const videoInfo = await VideoService.getVideoInfo(url);

      res
        .status(statusCode.OK)
        .json(successRes("Video info fetched successfully", videoInfo));
    } catch (error) {
      next(error);
    }
  }

  static async downloadAudio(req: Request, res: Response, next: NextFunction) {
    try {
      const { url } = req.body;

      const videoInfo = await VideoService.getVideoInfo(url);
      const audioPath = await VideoService.downloadAudio(url);

      res
        .status(statusCode.OK)
        .json(successRes("Audio downloaded", { ...videoInfo, audioPath }));
    } catch (error) {
      next(error);
    }
  }

  static async transcribeVideo(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { url } = req.body;
      const { userId } = (req as Request & JwtPayloadWithUser).user!;

      const user = await AuthService.getUserById(userId!);
      const videoInfo = await VideoService.getVideoInfo(url);

      // create background job
      const { jobId } = await JobService.addTranscriptionJob(
        url,
        videoInfo,
        user
      );

      res.status(statusCode.CREATED).json(
        successRes("Transcription job created successfully", {
          jobId,
          videoInfo,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async getTranscriptionStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { jobId } = req.params;
      const status = await JobService.getJobStatus(jobId);

      res
        .status(statusCode.OK)
        .json(successRes("Job status fetched successfully", status));
    } catch (error) {
      next(error);
    }
  }

  static async getVideoById(req: Request, res: Response, next: NextFunction) {
    try {
      const { videoId } = req.params;
      const { userId } = (req as Request & JwtPayloadWithUser).user!;

      const video = await VideoService.getVideoById(videoId, userId);

      if (!video) {
        throw new AppError(statusCode.NOT_FOUND, "Video not found");
      }

      const transformedVideo = {
        id: video.id,
        url: video.url,
        title: video.title,
        description: video.description,
        duration: video.duration,
        author: video.author,
        thumbnail: video.thumbnail,
        status: video.status,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
        transcription: video.transcription
          ? {
              text: video.transcription.text,
              confidence: video.transcription.confidence,
              isMusic: video.transcription.isMusic,
              createdAt: video.transcription.createdAt,
            }
          : null,
        analysis: video.analysis
          ? {
              summary: video.analysis.summary,
              keyPoints: video.analysis.keyPoints,
              sentiment: video.analysis.sentiment,
              topics: video.analysis.topics,
              tags: video.analysis.tags,
              createdAt: video.analysis.createdAt,
            }
          : null,
      };

      res
        .status(statusCode.OK)
        .json(successRes("Video fetched successfully", transformedVideo));
    } catch (error) {
      next(error);
    }
  }

  static async getUserVideos(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = (req as Request & JwtPayloadWithUser).user!;
      const videos = await VideoService.getUserVideos(userId);

      const transformedVideos = videos.map((video) => ({
        id: video.id,
        url: video.url,
        title: video.title,
        description: video.description,
        duration: video.duration,
        author: video.author,
        thumbnail: video.thumbnail,
        status: video.status,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
        transcription: video.transcription
          ? {
              text: video.transcription.text,
              confidence: video.transcription.confidence,
              isMusic: video.transcription.isMusic,
              createdAt: video.transcription.createdAt,
            }
          : null,
        analysis: video.analysis
          ? {
              summary: video.analysis.summary,
              keyPoints: video.analysis.keyPoints,
              sentiment: video.analysis.sentiment,
              topics: video.analysis.topics,
              tags: video.analysis.tags,
              createdAt: video.analysis.createdAt,
            }
          : null,
      }));

      res
        .status(statusCode.OK)
        .json(successRes("Videos fetched successfully", transformedVideos));
    } catch (error) {
      next(error);
    }
  }

  static async getAllJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = (req as Request & JwtPayloadWithUser).user!;

      const jobs = await JobService.getAllJobs(userId);

      res
        .status(statusCode.OK)
        .json(successRes("Jobs fetched successfully", jobs));
    } catch (error) {
      next(error);
    }
  }
}

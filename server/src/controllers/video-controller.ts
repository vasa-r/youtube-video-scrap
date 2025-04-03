import { NextFunction, Request, Response } from "express";
import { VideoService } from "../services/video-services";
import { JwtPayloadWithUser, statusCode } from "../types/types";
import { successRes } from "../utils/response-format";
import { AuthService } from "../services/auth-services";
import { JobService } from "../services/jobs-services";

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
}

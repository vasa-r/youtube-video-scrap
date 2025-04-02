import { NextFunction, Request, Response } from "express";
import { VideoService } from "../services/video-services";
import { statusCode } from "../types/types";
import { successRes } from "../utils/response-format";

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
}

import path from "path";
import { mkdir, stat } from "fs/promises";
import youtubeDl from "youtube-dl-exec";
import ffmpeg from "@ffmpeg-installer/ffmpeg";
import ytdl from "ytdl-core";
import { AppDataSource } from "../config/db";
import { Video } from "../entities/video-entity";
import { statusCode, VideoInfo, YoutubeDLOutput } from "../types/types";
import logger from "../logger/logger";
import { AppError } from "../utils/error";

export class VideoService {
  private static readonly AUDIO_DIR = path.join(process.cwd(), "temp", "audio");
  private static readonly videoRepo = AppDataSource.getRepository(Video);

  static async ensureDirectoryExists() {
    await mkdir(VideoService.AUDIO_DIR, { recursive: true });
  }

  static async getVideoInfo(url: string): Promise<VideoInfo> {
    try {
      const rawInfo = await youtubeDl(url, {
        dumpSingleJson: true,
        noWarnings: true,
        preferFreeFormats: true,
        ffmpegLocation: ffmpeg.path,
        // exec: path.resolve(__dirname, "../../bin/yt-dlp"), //this is just to ensure to use manually downloaded yt-dlp executable
        noCheckCertificates: true,
      });

      const info = rawInfo as YoutubeDLOutput;

      if (!info.title || !info.uploader || typeof info.duration !== "number") {
        throw new AppError(statusCode.BAD_REQUEST, "Invalid Video Info");
      }

      const thumbnail =
        info.thumbnail ||
        (info as any).thumbnails?.[0]?.url ||
        `https://i.ytimg.com/vi/${ytdl.getVideoID(url)}/maxresdefault.jpg`;

      return {
        title: info.title,
        description: info.description || "",
        duration: info.duration,
        author: info.uploader,
        videoUrl: url,
        thumbnailUrl: thumbnail,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        if (error.message.includes("Private video")) {
          throw new AppError(statusCode.FORBIDDEN, "Video is private");
        }

        if (error.message.includes("not available")) {
          throw new AppError(statusCode.NOT_FOUND, "Video not found");
        }

        if (
          error.message.includes(
            "This video is available to this channel's members"
          )
        ) {
          throw new AppError(
            statusCode.NOT_FOUND,
            "Video available only for channel members"
          );
        }

        throw new AppError(statusCode.SERVER_ERROR, "Error getting video info");
      }
      throw new AppError(statusCode.SERVER_ERROR, "Error getting video info");
    }
  }

  static async downloadAudio(url: string): Promise<string> {
    try {
      this.ensureDirectoryExists();

      const videoId = ytdl.getVideoID(url);
      const audioPath = path.join(this.AUDIO_DIR, `${videoId}.mp3`);

      await youtubeDl(url, {
        extractAudio: true,
        audioFormat: "mp3",
        audioQuality: 0,
        output: audioPath,
        noWarnings: true,
        noCheckCertificates: true,
        preferFreeFormats: true,
        ffmpegLocation: ffmpeg.path,
      });

      const fileStats = await stat(audioPath);

      if (fileStats.size === 0) {
        throw new AppError(statusCode.NOT_IMPLEMENTED, "Failed to downloaded");
      }

      return audioPath;
    } catch (error) {
      logger.error(`Error downloading video: ${error}`);
      if (error instanceof Error) {
        if (error.message.includes("ffmpeg")) {
          throw new AppError(
            statusCode.SERVER_ERROR,
            "Failed to download audio"
          );
        }

        throw new AppError(statusCode.SERVER_ERROR, "Failed to download audio");
      }
      throw new AppError(statusCode.SERVER_ERROR, "Failed to download audio");
    }
  }

  //   static async
}

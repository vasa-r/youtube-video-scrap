import { NextFunction, Request, Response } from "express";
import * as z from "zod";
import { AppError } from "../utils/error";
import { statusCode } from "../types/types";

const youtubeUrlSchema = z
  .string()
  .url()
  .refine(
    (url) => {
      const youtubeRegex =
        /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})(?:\S+)?$/;
      return youtubeRegex.test(url);
    },
    { message: "Invalid YouTube URL format" }
  );

const validateYtUrl = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url } = req.body;

    if (!url) {
      throw new AppError(statusCode.BAD_REQUEST, "URL is required to proceed");
    }

    const result = youtubeUrlSchema.safeParse(url);

    if (!result.success) {
      throw new AppError(
        statusCode.NOT_ACCEPTABLE,
        result.error.errors[0].message
      );
    }

    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      new AppError(statusCode.NOT_ACCEPTABLE, error.errors[0].message);
    } else {
      next(error);
    }
  }
};

export { validateYtUrl };

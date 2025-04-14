import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth-services";
import { JwtPayloadWithUser, statusCode } from "../types/types";
import { successRes } from "../utils/response-format";

import { AppError } from "../utils/error";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { userName, email, password } = req.body;

      const result = await AuthService.register(userName, email, password);

      res
        .status(statusCode.CREATED)
        .json(successRes("User created successfully", result));
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      res
        .status(statusCode.ACCEPTED)
        .json(successRes("Login successful", result));
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.query;

      if (!token || typeof token !== "string") {
        throw new AppError(
          statusCode.BAD_REQUEST,
          "Invalid Verification Token"
        );
      }

      const result = await AuthService.verifyEmail(token);

      res
        .status(statusCode.ACCEPTED)
        .json(successRes("Email verified successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async resendVerificationEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;

      await AuthService.resendVerificationEmail(email);

      res
        .status(statusCode.OK)
        .json(successRes("Verification Email sent to your Mail Address"));
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = (req as Request & JwtPayloadWithUser).user!;
      const user = await AuthService.getUserById(userId);

      res
        .status(statusCode.OK)
        .json(successRes("Profile fetched successfully", user));
    } catch (error) {
      next(error);
    }
  }
}

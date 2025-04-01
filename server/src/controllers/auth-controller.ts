import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth-services";
import { RegisterResponse, statusCode } from "../types/types";
import { successRes } from "../utils/response-format";
import { User } from "../entities/user-entity";
import { AppError } from "../utils/error";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { userName, email, password } = req.body;

      const result: RegisterResponse = await AuthService.register(
        userName,
        email,
        password
      );

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

      const result: RegisterResponse = await AuthService.login(email, password);

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
}

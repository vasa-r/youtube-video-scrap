import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/error";
import { JwtPayloadWithUser, statusCode } from "../types/types";
import { AuthService } from "../services/auth-services";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError(statusCode.UNAUTHORIZED, "Header not found");
    }

    const token = header.split(" ")[1];

    if (!token) {
      throw new AppError(statusCode.UNAUTHORIZED, "UNAUTHORIZED");
    }

    const decoded = AuthService.verifyValidToken(token);

    if (!decoded) {
      throw new AppError(statusCode.UNAUTHORIZED, "UNAUTHORIZED");
    }

    if (decoded.userName && decoded.userEmail && decoded.userId) {
      (req as Request & JwtPayloadWithUser).user = decoded;
      next();
    } else {
      throw new AppError(statusCode.UNAUTHORIZED, "UNAUTHORIZED");
    }
  } catch (error) {
    next(error);
  }
};

export default verifyToken;

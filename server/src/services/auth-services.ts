import { AppDataSource } from "../config/db";
import { envConfig } from "../config/env-config";
import { User } from "../entities/user-entity";
import logger from "../logger/logger";
import { JwtPayloadWithUser, statusCode } from "../types/types";
import { AppError } from "../utils/error";
import crypto from "crypto";
import jwt, { JsonWebTokenError, Secret, SignOptions } from "jsonwebtoken";
import { EmailService } from "./email-service";

export class AuthService {
  private static readonly userRepo = AppDataSource.getRepository(User);
  private static readonly JWT_SECRET: Secret = envConfig.jwt.secret;
  private static readonly JWT_EXPIRES_IN = envConfig.jwt
    .expiresIn as SignOptions["expiresIn"];

  // creating user
  static async register(userName: string, email: string, password: string) {
    const isUserExists = await this.userRepo.findOne({ where: { email } });

    if (isUserExists) {
      throw new AppError(statusCode.CONFLICT, "User already exists");
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24);

    const user = new User();
    user.userName = userName;
    user.email = email;
    user.hashedPassword = password;
    user.emailVerificationToken = verificationToken;
    user.emailVerificationTokenExpires = tokenExpires;

    await this.userRepo.save(user);

    // send verification email
    await EmailService.sendVerificationEmail(email, verificationToken);

    const token = this.generateToken(user);

    return { user, token };
  }

  // login user
  static async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new AppError(statusCode.NOT_FOUND, "No user found. Try to Sign in");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AppError(statusCode.UNAUTHORIZED, "Incorrect Password");
    }

    user.lastLogin = new Date();
    await this.userRepo.save(user);

    const token = this.generateToken(user);

    return { user, token };
  }

  static async verifyEmail(token: string) {
    const user = await this.userRepo.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new AppError(statusCode.NOT_FOUND, "Invalid verification token");
    }

    if (
      !user.emailVerificationTokenExpires ||
      user.emailVerificationTokenExpires < new Date()
    ) {
      throw new AppError(
        statusCode.NOT_ACCEPTABLE,
        "Email verification token expired"
      );
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpires = null;

    await this.userRepo.save(user);

    // sending welcome email
    await EmailService.sendWelcomeEmail(user.email, user.userName);
    return;
  }

  // resend verification mail
  static async resendVerificationEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new AppError(statusCode.NOT_FOUND, "User not found");
    }

    if (user.isEmailVerified) {
      throw new AppError(statusCode.CONFLICT, "Email already verified");
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationTokenExpires = tokenExpires;

    await this.userRepo.save(user);

    await EmailService.sendVerificationEmail(email, verificationToken);
    return;
  }

  // generating jwt token
  static generateToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        userEmail: user.email,
        userName: user.userName,
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }

  // verify token
  static verifyValidToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JwtPayloadWithUser;
      return decoded;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        if (error.message.includes("jwt expired")) {
          throw new AppError(
            statusCode.UNAUTHORIZED,
            "Session expired. Login again"
          );
        }
      }
      throw new AppError(statusCode.UNAUTHORIZED, "UNAUTHORIZED");
    }
  }

  static async getUserById(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        userName: true,
        isEmailVerified: true,
        emailVerificationToken: true,
        emailVerificationTokenExpires: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: ["videos"],
    });
    if (!user) {
      throw new AppError(statusCode.NOT_FOUND, "No user found");
    }

    return user;
  }
}

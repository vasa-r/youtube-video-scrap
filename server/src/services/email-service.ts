import { Resend } from "resend";
import { envConfig } from "../config/env-config";
import { verificationEmailTemplate } from "../templates/emails/verification-template";
import { AppError } from "../utils/error";
import { statusCode } from "../types/types";
import logger from "../logger/logger";

export class EmailService {
  private static readonly resend = new Resend(envConfig.resend.apiKey);
  private static readonly FROM_EMAIL =
    "YouTube Summary Scrapper AI <onboarding@resend.dev>";

  static async sendVerificationEmail(email: string, token: string) {
    try {
      const verificationUrl = `${envConfig.client.url}/auth/verify-email?token=${token}`;

      const { error } = await this.resend.emails.send({
        from: this.FROM_EMAIL,
        to: email,
        subject: "Verify your email",
        html: verificationEmailTemplate(verificationUrl),
      });

      if (error) {
        throw new AppError(
          statusCode.SERVER_ERROR,
          "Failed to send verification email"
        );
      }
    } catch (error) {
      logger.error(`Error sending email: ${error}`);
      throw new AppError(
        statusCode.SERVER_ERROR,
        "Failed to send verification email"
      );
    }
  }
}

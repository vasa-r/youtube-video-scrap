import { baseEmailTemplate } from "./base-template";

export const welcomeEmailTemplate = (userName: string): string => {
  return baseEmailTemplate({
    title: "Welcome to Our Platform!",
    body: `
        <p style="font-size: 18px; color: #2C3E50; font-family: 'Arial', sans-serif; margin-bottom: 20px;">Hi <strong style="color: #2980B9;">${userName}</strong>,</p>
        <p style="font-size: 16px; color: #34495E; font-family: 'Arial', sans-serif; line-height: 1.6;">
          We’re thrilled to have you on board! Get ready to explore all the amazing features we have to offer.
        </p>
        <p style="font-size: 16px; color: #34495E; font-family: 'Arial', sans-serif; line-height: 1.6;">
          If you have any questions, don’t hesitate to reach out to our support team.
        </p>
        <p style="font-size: 16px; color: #34495E; font-family: 'Arial', sans-serif; line-height: 1.6;">
          Happy exploring! 🚀
        </p>
        <p style="font-size: 14px; color: #7F8C8D; font-family: 'Arial', sans-serif; text-align: center; margin-top: 40px;">
          Best regards,<br />Vasanth
        </p>
    `,
  });
};

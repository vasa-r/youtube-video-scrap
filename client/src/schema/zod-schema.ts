import * as z from "zod";

export const registerSchema = z
  .object({
    userName: z
      .string()
      .min(3, { message: "User name must be at least 3 characters" }),
    email: z.string().email({ message: "Please enter valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password must match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const urlSchema = z.object({
  url: z
    .string()
    .url({ message: "Must be a valid URL" })
    .refine(
      (url) => {
        const youtubeRegex =
          /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:shorts\/|embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})(?:\S+)?$/;
        return youtubeRegex.test(url);
      },
      {
        message: "Invalid YouTube URL format",
      }
    ),
});

export const resendEmailSchema = z.object({
  email: z.string().email({ message: "Please enter valid email address" }),
});

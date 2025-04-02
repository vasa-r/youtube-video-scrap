import { getEnv } from "../utils/get-env";

export const envConfig = {
  server: {
    port: getEnv("PORT", "8000"),
    env: getEnv("NODE_ENV", "development"),
    allowedOrigins: [""],
  },
  client: {
    url: getEnv("FRONTEND_URL"),
  },
  database: {
    url: getEnv(
      "DATABASE_URL",
      "postgres://postgres:postgres@localhost:5432/video_summarizer"
    ),
  },
  jwt: {
    secret: getEnv("JWT_SECRET", "secret"),
    expiresIn: getEnv("JWT_EXPIRES_IN", "24h"),
  },
  resend: {
    apiKey: getEnv("RESEND_API_KEY"),
  },
};

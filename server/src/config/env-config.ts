import { getEnv } from "../utils/get-env";

export const envConfig = {
  server: {
    port: getEnv("PORT", "8000"),
    adminPort: getEnv("ADMIN_PORT", "8081"),
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
  gemini: {
    apiKey: getEnv("GEMINI_API_KEY"),
  },
  redis: {
    host: getEnv("REDIS_HOST", "localhost"),
    port: parseInt(getEnv("REDIS_PORT", "6379")),
  },
};

import { getEnv } from "../utils/get-env";

export const envConfig = {
  server: {
    port: getEnv("PORT", "8000"),
    env: getEnv("NODE_ENV", "development"),
  },
  database: {
    url: getEnv(
      "DATABASE_URL",
      "postgres://postgres:postgres@localhost:5432/video_summarizer"
    ),
  },
  //   jwt: {
  //     secret: getEnv("JWT_SECRET"),
  //     expiresIn: getEnv("JWT_EXPIRES_IN", "1h"),
  //   },
  //   thirdParty: {
  //     googleApiKey: getEnv("GOOGLE_API_KEY"),
  //   },
};

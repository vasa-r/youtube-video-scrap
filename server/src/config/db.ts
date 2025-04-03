import { DataSource } from "typeorm";
import { envConfig } from "./env-config";
import logger from "../logger/logger";
import { User } from "../entities/user-entity";
import { Video } from "../entities/video-entity";
import { Transcription } from "../entities/transcription-entity";
import { Analysis } from "../entities/analysis-entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: envConfig.database.url,
  synchronize: envConfig.server.env === "development",
  entities: [User, Video, Transcription, Analysis],
  migrations: [],
  subscribers: [],
});

export const connectDb = async () => {
  try {
    await AppDataSource.initialize();
    logger.info("Database Connected Successfully");
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error(`Database Connection Error: ${errMessage}`);
    throw error;
  }
};

import { DataSource } from "typeorm";
import { envConfig } from "./env-config";
import logger from "../logger/logger";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: envConfig.database.url,
  synchronize: envConfig.server.env === "development",
  entities: [],
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

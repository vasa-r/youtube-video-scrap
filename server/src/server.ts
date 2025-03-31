import express from "express";
import "dotenv/config";
import { envConfig } from "./config/env-config";
import logger from "./logger/logger";
import { connectDb } from "./config/db";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

const initServer = async () => {
  try {
    await connectDb();

    app.listen(PORT, () => {
      logger.info(`Server is up and running on port: ${PORT}`);
      logger.info(envConfig.database.url);
    });
  } catch (error) {
    logger.error("Error starting server.");
    process.exit(1);
  }
};

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Hey there. You're good to go.",
  });
});

initServer().catch((err) => {
  logger.error(err);
  process.exit(1);
});

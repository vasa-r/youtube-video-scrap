import express from "express";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";

// Configuration & Logging
import { envConfig } from "./config/env-config";
import { connectDb } from "./config/db";
import logger, { stream } from "./logger/logger";

// Utility Functions & Constants
import { successRes } from "./utils/response-format";
import { statusCode } from "./types/types";

// Middlewares
import errorHandler from "./middleware/error-handler";

// Routes
import v1 from "./routes/v1-route";

const app = express();
const PORT = process.env.PORT || 8000;

const initServer = async () => {
  try {
    await connectDb();

    app.listen(PORT, () => {
      logger.info(`Server is up and running on port: ${PORT}`);
    });
  } catch (error) {
    logger.error("Error starting server.");
    process.exit(1);
  }
};

app.use(cors());
app.use(express.json());
app.use(
  morgan(envConfig.server.env === "development" ? "dev" : "combined", {
    stream,
  })
);

app.get("/", (_, res) => {
  res.status(statusCode.OK).json(successRes("Yo! Your API is up N running"));
});

app.use("api/v1", v1);

app.use("*", (req, res) => {
  res.status(statusCode.NOT_FOUND).json({
    success: false,
    message: `Endpoint not found - ${req.originalUrl}`,
  });
});

app.use(errorHandler);

initServer().catch((err) => {
  logger.error(err);
  process.exit(1);
});

import winston from "winston";
import { envConfig } from "../config/env-config";
import path from "path";
import fs from "fs";

// log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// colors for each levels
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

// linking colors to each levels in winston
winston.addColors(colors);

// format for console outputs
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp}< >${info.level}: ${info.message}`
  )
);

// format for file output (logs with JSON format)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.json()
);

// show logs based on node environment
const level = () => {
  const env = envConfig.server.env || "development";
  return env === "development" ? "debug" : "info";
};

// defining logger directory and files
const logDir = "logs";
const errorLogs = path.join(logDir, "error-logs.log");
const combinedLogs = path.join(logDir, "combined-logs.log");

// create log directory if it doesn't exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// actual logger instance

const logger = winston.createLogger({
  level: level(),
  levels,
  format: fileFormat,
  transports: [
    new winston.transports.File({ filename: errorLogs, level: "error" }),
    new winston.transports.File({ filename: combinedLogs }),
  ],
});

if (envConfig.server.env !== "production") {
  logger.add(new winston.transports.Console({ format: consoleFormat }));
}

// stream for morgan middleware
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export default logger;

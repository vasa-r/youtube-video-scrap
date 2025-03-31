import logger from "../logger/logger";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const handleError = (error: Error | AppError) => {
  if (error instanceof AppError && error.isOperational) {
    return {
      success: false,
      statusCode: error.statusCode,
      message: error.message,
    };
  }

  logger.error(error);
  return {
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
  };
};

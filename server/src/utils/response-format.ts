import { envConfig } from "../config/env-config";

interface SuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
}

interface ErrorResponse {
  success: false;
  message: string;
  error?: any;
}

export const successRes = <T>(
  message: string,
  data?: T
): SuccessResponse<T> => ({
  success: true,
  message,
  data,
});

export const errorRes = (
  message: string = "Error occurred during process",
  error?: any
): ErrorResponse => ({
  success: false,
  message,
  ...(envConfig.server.env === "development" && { error }),
});

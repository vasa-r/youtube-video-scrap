import { Request, Response, NextFunction } from "express";
import logger from "../logger/logger";
import { handleError } from "../utils/error";
import { errorRes } from "../utils/response-format";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.stack || err.message);
  const errDetails = handleError(err);

  res.status(errDetails.statusCode).json(errorRes(errDetails.message));
};

export default errorHandler;

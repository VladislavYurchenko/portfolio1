import { Request, Response, Errback, NextFunction } from "express";
import { logger } from "../";
import ApiError from "../errors/ApiError";
import { ProblemsType } from "../types/dataTypes/ProblemsTypes";
import { ServerResponce } from "../types/dataTypes/ServerResponce";

function ErrorsMiddleware(err: Errback, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof ApiError) {
    console.log(new ServerResponce(false, err.message, { problem: err.message }));

    res.status(401).send(new ServerResponce(false, err.message, { problem: err.message }));
  } else {
    logger.error("ErrorsMiddleware");
    logger.error(err);
    res.send(new ServerResponce(false, "неизвестная ошибка", { problem: ProblemsType.UNKNOWN_ERROR }));
  }
  next(err);
}

export default ErrorsMiddleware;

import TokenService from "../services/TokenServis";
import { Request, Response, NextFunction } from "express";
import { User } from "../types/dataTypes/User";
import ApiError from "../errors/ApiError";
interface reqUser {
  user: User;
}

function AuthMiddleware(req: Request & reqUser, res: Response, next: NextFunction): never | void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next(ApiError.UnAuthorizedError());
    }
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      next(ApiError.UnAuthorizedError());
    }
    const userData: User | null = TokenService.validateAccesssToken(accessToken);
    if (!userData) {
      next(ApiError.UnAuthorizedError());
    }
    req.user = userData;
    next();
  } catch (error) {
    next(ApiError.UnAuthorizedError());
  }
}
export default AuthMiddleware;

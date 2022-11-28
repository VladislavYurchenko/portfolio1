import { Error } from "mongoose";
import { ProblemsType } from "../types/dataTypes/ProblemsTypes";

class ApiError extends Error {
  status: number;
  errors?: Error;
  constructor(status: number, message: string, errors?: Error) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
  }

  static UnAuthorizedError(): never {
    throw new ApiError(401, ProblemsType.USER_UNAUTHORIZED);
  }
}
export default ApiError;

import { Request, Response, NextFunction } from "express";
import { ProblemsType } from "../types/dataTypes/ProblemsTypes";
import { ServerResponce, UserAuthResponce } from "../types/dataTypes/ServerResponce";
import AuthService from "./../services/AuthServis";
import { validationResult } from "express-validator";
class AuthController {
  static async registration(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
          if (error.param === "email") {
            res.send(new ServerResponce(false, "bad input data", { problem: ProblemsType.EMAIL_IS_NOT_VALID }));
          }
          if (error.param === "password") {
            res.send(new ServerResponce(false, "bad input data", { problem: ProblemsType.UNSUITABLE_PASSWORD }));
          }
        });
      }
      const email: string = req.body.email;
      const password: string = req.body.password;
      const name: string = req.body.name;
      const userData = await AuthService.registration(email, password, name);
      if (userData instanceof UserAuthResponce) {
        this.successAuth(res, userData);
      } else {
        res.send(new ServerResponce(false, "user already exists", { problem: ProblemsType.USER_ALREADY_EXISTS }));
      }
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const email: string = req.body.email;
      const password: string = req.body.password;
      const userData = await AuthService.login(email, password);
      if (userData) {
        this.successAuth(res, userData);
      } else {
        res.send(new ServerResponce(false, "bad input data", { problem: ProblemsType.BAD_INPUT_DATA }));
      }
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.cookies;
      const data = await AuthService.logout(refreshToken);
      if (data) {
        res.clearCookie("refreshToken");
        res.send(new ServerResponce(true, "logout success", {}));
      } else {
        res.send(new ServerResponce(false, "failed to logout", { problem: ProblemsType.FAILED_LOGOUT }));
      }
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        res.send(new ServerResponce(false, "bad token", { problem: ProblemsType.BAD_TOKEN }));
        return;
      }

      const userData: UserAuthResponce | false = await AuthService.refresh(refreshToken);

      if (userData) {
        this.successAuth(res, userData);
      } else {
        res.send(new ServerResponce(false, "bad token", { problem: ProblemsType.BAD_TOKEN }));
      }
    } catch (error) {
      next(error);
    }
  }

  static async successAuth(res: Response, userData: UserAuthResponce): Promise<void> {
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 10 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.send(new ServerResponce(true, "", userData));
  }
}
export default AuthController;

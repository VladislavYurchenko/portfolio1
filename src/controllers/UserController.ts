import { Request, Response, NextFunction } from "express";
import { ProblemsType } from "../types/dataTypes/ProblemsTypes";
import UserServis from "../services/UserServis";
import { ServerResponce, UserAuthResponce } from "../types/dataTypes/ServerResponce";
import { reqUser } from "../types/dataTypes/User";
import AuthController from "./AuthController";
import { validationResult } from "express-validator";
class UserController {
  static async changeName(req: Request & reqUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const name = req.body.name;
      const id = req.user.id;
      const response: UserAuthResponce = await UserServis.changeName(name, id);
      AuthController.successAuth(res, response);
    } catch (error) {
      next(error);
    }
  }

  static async changeEmail(req: Request & reqUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.send(new ServerResponce(false, "incorrect email", { problem: ProblemsType.EMAIL_IS_NOT_VALID }));
      }
      const email = req.body.email;
      const id = req.user.id;
      const data: UserAuthResponce | false = await UserServis.changeEmail(email, id);
      if (data) {
        AuthController.successAuth(res, data);
      } else {
        res.send(new ServerResponce(false, "email occupied", { problem: ProblemsType.EMAIL_OCCUPIED }));
      }
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request & reqUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);

        res.send(new ServerResponce(false, "unsuitable password", { problem: ProblemsType.UNSUITABLE_PASSWORD }));
        return;
      }
      const oldPassword = req.body.oldPassword;
      const newPassword = req.body.newPassword;
      const id = req.user.id;
      const data: UserAuthResponce | ProblemsType = await UserServis.changePassword(id, oldPassword, newPassword);
      if (data instanceof UserAuthResponce) {
        AuthController.successAuth(res, data);
      } else {
        res.send(new ServerResponce(false, "error", { problem: data }));
      }
    } catch (error) {
      next(error);
    }
  }

  static async deleteAccount(req: Request & reqUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const password = req.body.password;
      const id = req.user.id;
      const data: boolean | ProblemsType = await UserServis.deleteAccount(id, password);
      if (data === true) {
        res.clearCookie("refreshToken");
        res.send(new ServerResponce(true, "account has deleted"));
      } else {
        res.send(new ServerResponce(false, "error", { problem: data }));
      }
    } catch (error) {
      next(error);
    }
  }

  static async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.send("it's ok bro");
    } catch (error) {
      next(error);
    }
  }
}
export default UserController;

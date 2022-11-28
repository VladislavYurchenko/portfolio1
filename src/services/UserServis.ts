import { User } from "../types/dataTypes/User";
import UserModel from "../models/UserModel";
import AuthService from "./AuthServis";
import { UserAuthResponce } from "../types/dataTypes/ServerResponce";
import { SecurityServis } from "./SecurityServis";
import { ProblemsType } from "../types/dataTypes/ProblemsTypes";
import FilesServis from "./FilesServis";

export default class UserServis {
  static async changeName(name: string, id: string): Promise<UserAuthResponce> {
    const oldUserData = await UserModel.findById(id);
    oldUserData.name = name;
    const newUserData: User = new User(
      await UserModel.findByIdAndUpdate(id, oldUserData, {
        new: true,
      })
    );
    return AuthService.genResponse(newUserData);
  }

  static async changeEmail(email: string, id: string): Promise<UserAuthResponce | false> {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      return false;
    }
    const oldUserData = await UserModel.findById(id);
    oldUserData.email = email;
    const newUserData: User = new User(
      await UserModel.findByIdAndUpdate(id, oldUserData, {
        new: true,
      })
    );
    return AuthService.genResponse(newUserData);
  }

  static async changePassword(id: string, oldPassword: string, newPassword: string): Promise<UserAuthResponce | ProblemsType> {
    const user = await UserModel.findById(id);
    if (!user) {
      return ProblemsType.USER_UNAUTHORIZED;
    }
    console.log(newPassword);
    const check = await SecurityServis.checkPasswords(oldPassword, user.password);
    console.log(check);
    if (!check) {
      return ProblemsType.INCORRECT_PASSWORD;
    }
    const hashpass = await SecurityServis.genPreservedPassword(newPassword);
    user.password = hashpass;
    const newUserData: User = new User(
      await UserModel.findByIdAndUpdate(id, user, {
        new: true,
      })
    );
    return AuthService.genResponse(newUserData);
  }

  static async deleteAccount(id: string, password: string): Promise<boolean | ProblemsType> {
    const user = await UserModel.findById(id);
    if (!user) {
      return ProblemsType.USER_UNAUTHORIZED;
    }
    const check = await SecurityServis.checkPasswords(password, user.password);
    if (!check) {
      return ProblemsType.INCORRECT_PASSWORD;
    }

    const dir = FilesServis.generatePath(process.env.USERDATADIR, user.id.toString());
    FilesServis.deleteFile(dir, true);

    const data = await UserModel.findByIdAndDelete(id);

    if (!data) {
      return ProblemsType.UNKNOWN_ERROR;
    } else {
      return true;
    }
  }

  static async activate(activationLink: string): Promise<boolean> {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      return false;
    }
    user.isActivated = true;
    await UserModel.findOneAndUpdate({ activationLink }, user, {
      new: true,
    });
    return true;
  }
}

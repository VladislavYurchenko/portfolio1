import { v4 } from "uuid";

import { User } from "../types/dataTypes/User";
import UserModel from "../models/UserModel";
import TokenService from "./TokenServis";
import { UserAuthResponce } from "../types/dataTypes/ServerResponce";
import { ProblemsType } from "../types/dataTypes/ProblemsTypes";
import { SecurityServis } from "./SecurityServis";

class AuthService {
  static async registration(email: string, password: string, name: string): Promise<UserAuthResponce | ProblemsType> {
    const candidate = await UserModel.findOne({ email });
    if (candidate) return ProblemsType.USER_ALREADY_EXISTS;
    const hashpass = await SecurityServis.genPreservedPassword(password);
    const activationLink = v4();
    const user: User = new User(
      await UserModel.create({
        email: email,
        password: hashpass,
        name: name,
        activationLink: activationLink,
      })
    );
    return await this.genResponse(user);
  }

  static async login(email: string, password: string): Promise<UserAuthResponce | false> {
    const dbdata = await UserModel.findOne({ email });
    if (!dbdata) return false;
    const user: User = new User(dbdata);
    const passwordIsEqual = await SecurityServis.checkPasswords(password, dbdata.password);
    if (!passwordIsEqual) return false;
    return await this.genResponse(user);
  }

  static async logout(refreshToken: string): Promise<boolean> {
    const token = await TokenService.deleteToken(refreshToken);
    if (token.deletedCount === 0) {
      return false;
    }
    return true;
  }

  static async refresh(refreshToken: string): Promise<UserAuthResponce | false> {
    if (!refreshToken) {
      return false;
    }
    const userData: User = TokenService.validateRefrefshToken(refreshToken);
    const dbToken = await TokenService.findToken(refreshToken);
    if (!userData || !dbToken) {
      return false;
    }
    const user: User = new User(await UserModel.findById(userData.id));
    return await this.genResponse(user);
  }

  static async genResponse(user: User): Promise<UserAuthResponce> {
    const tokens = TokenService.generateTokens(user);
    await TokenService.saveRefreshToken(user.id, tokens.refreshToken);
    const data = new UserAuthResponce(user, tokens.refreshToken, tokens.accessToken);
    return data;
  }
}
export default AuthService;

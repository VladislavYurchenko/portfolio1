import jwt from "jsonwebtoken";
import TokenModel from "../models/TokenModel";
import { User } from "../types/dataTypes/User";
import { Token } from "../types/dataTypes/Token";
interface DeleteResault {
  deletedCount: number;
}
class TokenService {
  static generateTokens(payload: User): { accessToken: string; refreshToken: string } {
    const accessToken: string = jwt.sign({ ...payload }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFE_TIME });
    const refreshToken: string = jwt.sign({ ...payload }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFE_TIME });
    return { accessToken, refreshToken };
  }

  static validateAccesssToken(token: string): User | null {
    try {
      const userData: User = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  static validateRefrefshToken(token: string): User | null {
    try {
      const userData: User = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  static async saveRefreshToken(userId: string, token: string): Promise<Token> {
    const tokenData = await TokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = token;
      return tokenData.save();
    }
    const newToken = await TokenModel.create({ user: userId, refreshToken: token });
    return newToken;
  }

  static async deleteToken(refreshToken: string): Promise<DeleteResault> {
    const tokenData: DeleteResault = await TokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  static async findToken(refreshToken: string): Promise<Token | null> {
    const tokenData: Token = await TokenModel.findOne({ refreshToken });
    return tokenData;
  }
}
export default TokenService;

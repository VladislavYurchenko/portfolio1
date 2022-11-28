import IUser from "../modelsInterfaces/IUser";
import { User } from "./User";

export class UserAuthResponce extends User {
  id: string;
  email: string;
  name?: string;
  isActivated?: boolean;
  refreshToken: string;
  accessToken: string;
  constructor(user: User, refreshToken: string, accessToken: string) {
    super(user as IUser);
    this.refreshToken = refreshToken;
    this.accessToken = accessToken;
  }
}

export class ServerResponce {
  status: boolean;
  message: string | null;
  data?: any;
  constructor(status: boolean, message: string | null, data?: any) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

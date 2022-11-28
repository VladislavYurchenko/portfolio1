import IUser from "./../modelsInterfaces/IUser";
export class Token {
  user: IUser["_id"];
  refreshToken: string;
}

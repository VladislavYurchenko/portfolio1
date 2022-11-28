import IUser from "./IUser";
import { Document } from "mongoose";
interface IToken extends Document {
  user: IUser["_id"];
  refreshToken: string;
}
export default IToken;

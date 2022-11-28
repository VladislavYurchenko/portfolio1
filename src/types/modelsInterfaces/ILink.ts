import IUser from "./IUser";
import { Document } from "mongoose";
interface ILink extends Document {
  user: IUser["_id"];
  name?: string;
  url?: string;
}
export default ILink;

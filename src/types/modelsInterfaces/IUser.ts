import { Document } from "mongoose";
interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  activationLink?: string;
  isActivated?: boolean;
}
export default IUser;

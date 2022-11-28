import mongoose, { Schema } from "mongoose";
import IUser from "../types/modelsInterfaces/IUser";

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "" },
  activationLink: { type: String },
  isActivated: { type: Boolean, default: false },
});

export default mongoose.model<IUser>("User", UserSchema);

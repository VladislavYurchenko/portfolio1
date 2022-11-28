import mongoose, { Schema } from "mongoose";
import ILink from "../types/modelsInterfaces/ILink";
const LinkSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId },
  name: { type: String, required: false },
  url: { type: String, required: false },
});

export default mongoose.model<ILink>("Links", LinkSchema);

import mongoose, { Schema } from "mongoose";
import IToken from "../types/modelsInterfaces/IToken";
const TokenSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId },
  refreshToken: { type: String, required: true },
});
export default mongoose.model<IToken>("Tokens", TokenSchema);

import { Document, Model, model, Schema } from "mongoose";

// Schema
const UserSchemaObj = new Schema<UserSchema>({
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
}, { timestamps: true });


// DO NOT export this
export interface UserSchema extends Document {
  username: string;
  password: string;
  email: string;
}

// Default export
export default model<UserSchema, Model<UserSchema>>("User", UserSchemaObj);
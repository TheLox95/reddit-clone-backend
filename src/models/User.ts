import { Document, Model, model, Types, Schema, Query } from "mongoose"

// Schema
const UserSchema = new Schema<IUserSchema>({
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
}, { timestamps: true })


// DO NOT export this
interface IUserSchema extends Document {
  username: string;
  password: string;
  email: string;
}

// DO NOT export
interface IUserBase extends IUserSchema {}

// Export this for strong typing
export interface IUser extends IUserBase {}

// Export this for strong typing
export interface IUser_populated extends IUserBase {}

// For model
export interface IUserModel extends Model<IUser> {}


// Default export
export default model<IUser, IUserModel>("User", UserSchema)
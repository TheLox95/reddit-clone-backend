import { Document, Model, model, Schema } from "mongoose";
import { hashSync } from 'bcrypt';

// Schema
const UserSchemaObj = new Schema<UserSchema>({
  username: {
    type: String,
    unique: true,
    required: true,
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

UserSchemaObj.pre<UserSchema>('save', function (next) {
  const saltRounds = 10;
  this.password = hashSync(this.password, saltRounds);

  next();
});

// DO NOT export this
export interface UserSchema extends Document {
  username: string;
  password: string;
  email: string;
}

// Default export
export default model<UserSchema, Model<UserSchema>>("User", UserSchemaObj);
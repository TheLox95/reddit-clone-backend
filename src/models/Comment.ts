import { Document, Model, model, Schema } from "mongoose";
import * as mongooseAutopopulate from 'mongoose-autopopulate';
import { UserSchema } from "./User";
import { PostSchema } from "./Post";

// Schema
const CommentSchemaObj = new Schema<CommentSchema>({
  body: {
    type: String,
    required: true,
  },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true }
}, { timestamps: true });

CommentSchemaObj.plugin(mongooseAutopopulate);

// DO NOT export this
export interface CommentSchema extends Document {
  body: string;
  author: UserSchema;
  post: PostSchema;
}

// Default export
export default model<CommentSchema, Model<CommentSchema>>("Comment", CommentSchemaObj);
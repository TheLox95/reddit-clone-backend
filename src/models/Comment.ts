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
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', required: true, autopopulate: true }],
  author: { type: Schema.Types.ObjectId, ref: 'User', autopopulate: true },
  rootPost: { type: Schema.Types.ObjectId, ref: 'Post' },
  post: { type: Schema.Types.ObjectId, ref: 'Post' }
}, { timestamps: true });

CommentSchemaObj.plugin(mongooseAutopopulate);

// DO NOT export this
export interface CommentSchema extends Document {
  body: string;
  author: UserSchema;
  rootPost: PostSchema;
  post?: PostSchema;
  comments: CommentSchema[];
}

// Default export
export default model<CommentSchema, Model<CommentSchema>>("Comment", CommentSchemaObj);
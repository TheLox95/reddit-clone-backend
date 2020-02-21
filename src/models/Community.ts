import { Document, Model, model, Schema } from "mongoose";
import * as mongooseAutopopulate from 'mongoose-autopopulate';
import { PostSchema } from "./Post";
import { UserSchema } from "./User";

// Schema
const CommunitySchemaObj = new Schema<CommunitySchema>({
  title: {
    type: String,
    required: true,
  },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

CommunitySchemaObj.plugin(mongooseAutopopulate);

// DO NOT export this
export interface CommunitySchema extends Document {
  title: string;
  posts: PostSchema[];
  author: UserSchema;
}


// Default export
export default model<CommunitySchema, Model<CommunitySchema>>("Community", CommunitySchemaObj);
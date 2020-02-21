import { Document, Model, model, Schema } from "mongoose";
import * as mongooseAutopopulate from 'mongoose-autopopulate';
import { CommentSchema } from "./Comment";
import { UserSchema } from "./User";
import { CommunitySchema } from "./Community";

// Schema
const PostSchemaObj = new Schema<PostSchema>({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true,
  },
  community: { type: Schema.Types.ObjectId, ref: 'Community' , required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' , required: true, autopopulate: true }],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true  }
}, { timestamps: true });

PostSchemaObj.plugin(mongooseAutopopulate);


// DO NOT export this
export interface PostSchema extends Document {
  title: string;
  body: string;
  community: CommunitySchema;
  comments: CommentSchema[];
  author: UserSchema;
}

// Default export
export default model<PostSchema, Model<PostSchema>>("Post", PostSchemaObj);
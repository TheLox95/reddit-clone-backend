import { Document, Model, model, Schema } from "mongoose";
import mongooseAutopopulate from 'mongoose-autopopulate';

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
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  author: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

PostSchemaObj.plugin(mongooseAutopopulate);


// DO NOT export this
export interface PostSchema extends Document {
  id: string;
  title: string;
  body: string;
}

// Default export
export default model<PostSchema, Model<PostSchema>>("Post", PostSchemaObj);
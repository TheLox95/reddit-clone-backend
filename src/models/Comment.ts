import { Document, Model, model, Schema } from "mongoose";
import * as mongooseAutopopulate from 'mongoose-autopopulate';

// Schema
const CommentSchemaObj = new Schema<CommentSchema>({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

CommentSchemaObj.plugin(mongooseAutopopulate);

// DO NOT export this
interface CommentSchema extends Document {
  id: string;
  body: string;
  author: string;
}

// Default export
export default model<CommentSchema, Model<CommentSchema>>("Comment", CommentSchemaObj);
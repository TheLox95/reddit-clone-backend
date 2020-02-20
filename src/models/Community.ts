import { Document, Model, model, Schema } from "mongoose";
import * as mongooseAutopopulate from 'mongoose-autopopulate';

// Schema
const CommunitySchemaObj = new Schema<CommunitySchema>({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
}, { timestamps: true });

CommunitySchemaObj.plugin(mongooseAutopopulate);

// DO NOT export this
interface CommunitySchema extends Document {
  id: string;
  body: string;
  author: string;
}


// Default export
export default model<CommunitySchema, Model<CommunitySchema>>("Community", CommunitySchemaObj);
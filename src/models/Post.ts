import { Document, Model, model, Types, Schema, Query } from "mongoose"

// Schema
const PostSchema = new Schema<IPostSchema>({
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
}, { timestamps: true })

PostSchema.plugin(require('mongoose-autopopulate'));


// DO NOT export this
interface IPostSchema extends Document {
  id: string;
  title: string;
  body: string;
}

// DO NOT export
interface IPostBase extends IPostSchema { }

// Export this for strong typing
export interface IPost extends IPostBase { }

// Export this for strong typing
export interface IPost_populated extends IPostBase { }

// For model
export interface IPostModel extends Model<IPost> { }


// Default export
export default model<IPost, IPostModel>("Post", PostSchema)
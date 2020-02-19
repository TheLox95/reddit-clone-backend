import { Document, Model, model, Types, Schema, Query } from "mongoose"

// Schema
const CommunitySchema = new Schema<ICommunitySchema>({
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
}, { timestamps: true })

CommunitySchema.plugin(require('mongoose-autopopulate'));

// DO NOT export this
interface ICommunitySchema extends Document {
  id: string;
  body: string;
  author: string;
}

// DO NOT export
interface ICommunityBase extends ICommunitySchema { }

// Export this for strong typing
export interface ICommunity extends ICommunityBase { }

// Export this for strong typing
export interface ICommunity_populated extends ICommunityBase { }

// For model
export interface ICommunityModel extends Model<ICommunity> { }


// Default export
export default model<ICommunity, ICommunityModel>("Community", CommunitySchema)
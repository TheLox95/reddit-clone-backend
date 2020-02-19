import { Document, Model, model, Types, Schema, Query } from "mongoose"

// Schema
const CommentSchema = new Schema<ICommentSchema>({
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
}, { timestamps: true })

CommentSchema.plugin(require('mongoose-autopopulate'));

// DO NOT export this
interface ICommentSchema extends Document {
  id: string;
  body: string;
  author: string;
}

// DO NOT export
interface IComentBase extends ICommentSchema { }

// Export this for strong typing
export interface IComent extends IComentBase { }

// Export this for strong typing
export interface IComent_populated extends IComentBase { }

// For model
export interface IComentModel extends Model<IComent> { }


// Default export
export default model<IComent, IComentModel>("Comment", CommentSchema)
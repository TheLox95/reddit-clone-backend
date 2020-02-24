import { Document, Model, model, Schema } from "mongoose";
import { CommentSchema } from "./Comment";
import { UserSchema } from "./User";
import { CommunitySchema } from "./Community";
import { Loaders } from "src/graphql/Loaders";

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
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' , required: true }],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true  }
}, { timestamps: true });

PostSchemaObj.statics.batchData = (loaders: Loaders, posts: PostSchema[]): Promise<PostSchema>[] => {
  return posts.map(async p => {
    p.author = await loaders.batchAuthors.load(p.author.toString());
    if (p.comments.length > 0) {
      p.comments = await Promise.all(p.comments.map(c => loaders.batchComments.load(c.toString())));
    }
    return p;
  });
};

// DO NOT export this
export interface PostSchema extends Document {
  title: string;
  body: string;
  community: CommunitySchema;
  comments: CommentSchema[];
  author: UserSchema;
}

export interface UserModel extends Model<PostSchema> {
  batchData: (loaders: Loaders, posts: PostSchema[]) => Promise<PostSchema>[];
}

// Default export
export default model<PostSchema, UserModel>("Post", PostSchemaObj);
import { Document, Model, model, Schema } from "mongoose";
import { PostSchema } from "./Post";
import { UserSchema } from "./User";
import { Loaders } from "src/graphql/Loaders";

// Schema
const CommunitySchemaObj = new Schema<CommunitySchema>({
  title: {
    type: String,
    required: true,
  },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

CommunitySchemaObj.statics.batchData = (loaders: Loaders, communities: CommunitySchema[]): Promise<CommunitySchema>[] => {
  return communities.map(async p => {
    p.author = await loaders.batchAuthors.load(p.author.toString());
    if (p.posts.length > 0) {
      p.posts = await Promise.all(p.posts.map(async c => {
        c = await loaders.batchPosts.load(c.toString());
        c.comments = await Promise.all(c.comments.map(o => loaders.batchComments.load(o.toString())));
        c.author = await loaders.batchAuthors.load(c.author.toString());
        return c;
      }));
    }
    return p;
  });
};

// DO NOT export this
export interface CommunitySchema extends Document {
  title: string;
  posts: PostSchema[];
  author: UserSchema;
}

export interface CommunityModel extends Model<CommunitySchema> {
  batchData: (loaders: Loaders, posts: CommunitySchema[]) => Promise<CommunitySchema>[];
}

// Default export
export default model<CommunitySchema, CommunityModel>("Community", CommunitySchemaObj);
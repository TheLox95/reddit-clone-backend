import { Document, Model, model, Schema } from "mongoose";
import { hashSync } from 'bcrypt';
import { PostSchema } from "./Post";
import { Loaders } from "src/graphql/Loaders";

// Schema
const UserSchemaObj = new Schema<UserSchema>({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post', required: true }],
}, { timestamps: true });

UserSchemaObj.pre<UserSchema>('save', function (next) {
  const saltRounds = 10;
  this.password = hashSync(this.password, saltRounds);

  next();
});

UserSchemaObj.statics.batchData = (loaders: Loaders, users: UserSchema[]): Promise<UserSchema>[] => {
  return users.map(async user => {
    user.posts = await Promise.all(user.posts.map(async p => {
      const post = await loaders.batchPosts.load(p.toString()); 
      post.author = await loaders.batchAuthors.load(post.author.toString());
      return post;
    }));

    return user;
  });
};

// DO NOT export this
export interface UserSchema extends Document {
  username: string;
  password: string;
  email: string;
  posts: PostSchema[];
}

export interface UserModel extends Model<UserSchema> {
  batchData: (loaders: Loaders, users: UserSchema[]) => Promise<UserSchema>[];
}

// Default export
export default model<UserSchema, UserModel>("User", UserSchemaObj);
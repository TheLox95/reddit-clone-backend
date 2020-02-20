import Post, { PostSchema } from "models/Post";
import { Resolver } from "./Resolver";
import User, { UserSchema } from "models/User";

export const posts: Resolver<{}, PostSchema[]> = () => Post.find().exec();
export const post: Resolver<{ id: string }, PostSchema> = (p, { id }) => Post.findOne({ _id: id }).exec();


export const user: Resolver<{ id: string }, UserSchema> = async (p, { id }) => {
    const u = await User.findOne({ _id: id }).exec();
    return u;
};

export const users: Resolver<{ offset?: number; limit?: number }, UserSchema[]> = async (p, { offset = 0, limit = 10 }) => {
    const u = await User.find().limit(limit).skip(offset).sort({date: 'desc'}).exec();
    return u;
};
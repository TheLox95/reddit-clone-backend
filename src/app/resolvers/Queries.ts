import Post, { PostSchema } from "models/Post";
import { Resolver } from "./Resolver";

export const posts: Resolver<{}, PostSchema[]> = () => Post.find().exec();

export const post: Resolver<{ id: string }, PostSchema> = (p, { id }) => Post.findOne({ _id: id }).exec();
import Post from "models/Post";
import { Resolver } from "./Resolver";
import User from "models/User";
import Community from "models/Community";
import { UserInputError } from "apollo-server";
import Comment from "models/Comment";

export const posts: Resolver<{ offset?: number; limit?: number }> = async (_, { offset = 0, limit = 10 }, { loaders }) => {
    const posts = await Post.find().limit(limit).skip(offset).sort({date: 'desc'}).exec();
    return Post.batchData(loaders, posts);
};
export const post: Resolver<{ id: string }> = async (_, { id }, { loaders }) => {
    const p = await Post.findOne({ _id: id }).exec();
    if (!p) return new UserInputError('Post does not exist.');
    return await Post.batchData(loaders, [p])[0];
};


export const user: Resolver<{ id: string }> = async (p, { id }) => {
    const u = await User.findOne({ _id: id }).exec();
    if (!u) return new UserInputError('User does not exist.');
    return u;
};

export const users: Resolver<{ offset?: number; limit?: number }> = async (p, { offset = 0, limit = 10 }) => {
    const u = await User.find().limit(limit).skip(offset).sort({date: 'desc'}).exec();
    return u;
};

export const community: Resolver<{ id: string }> = async (p, { id }, { loaders }) => {
    const c = await Community.findById(id).exec();
    if (!c) return new UserInputError('Community does not exist.');
    return Community.batchData(loaders, [c])[0];
};

export const communities: Resolver<{ offset?: number; limit?: number }> = async (p, { offset = 0, limit = 10 }, { loaders }) => {
    const communities = await Community.find().limit(limit).skip(offset).sort({date: 'desc'}).exec();
    return Community.batchData(loaders, communities);
};

export const subComments: Resolver<{ id: string }> = async (p, { id } ) => {
    const comment = await Comment.findById(id).exec();
    if (!comment) return new UserInputError('Comment does not exist.');

    return comment.comments;
};
import Post from "models/Post";
import { AuthenticatedResolver } from "../Decorators";
import Community from "models/Community";
import Comment from "models/Comment";
import { ValidationError } from "apollo-server";

export const postCreateOne = AuthenticatedResolver<{ title: string; body: string; communityId: string }>(async (_, { title, body, communityId }, { me }) => {
    const communityObj = await Community.findOne({ _id: communityId }).exec();
    if (!communityObj) throw new ValidationError('Community does not exist.');

    return Post.create({
        title,
        body,
        author: me.id,
        community: communityId
    });
});

export const communityCreateOne = AuthenticatedResolver<{ title: string }>(async (_, { title }, { me }) => {
    let c = await Community.create({ title, author: me.id });
    c = await c.populate('author').execPopulate();
    return c;
});

export const commentCreateOne = AuthenticatedResolver<{ body: string; postId: string; authorId: string }>(async (_, { body, postId }, { me }) => {
    const postObj = await Post.findOne({ _id: postId }).exec();
    if (!postObj) throw new ValidationError('Post does not exist.');
    
    const c = await Comment.create({ body, author: me.id, post: postObj.id });

    return c;
});

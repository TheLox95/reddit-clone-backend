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

export const commentCreateOne = AuthenticatedResolver<{ body: string; rootPostId: string; postId?: string; commentId?: string }>(async (_, { body, rootPostId, postId, commentId }, { me }) => {
    if (postId && commentId) throw new ValidationError('Cannot pass Post id and Comment ID at the same time.');

    const commentToSave = { body, author: me.id, comments: [], rootPost: rootPostId };

    if (postId) {
        const postObj = await Post.findOne({ _id: postId }).exec();
        if (!postObj) throw new ValidationError('Post does not exist.');

        const result = await Comment.create({ ...commentToSave, post: postId });
        return result;
    }

    if (commentId) {
        const commentObj = await Comment.findOne({ _id: commentId }).exec();
        if (!commentObj) throw new ValidationError('Comment does not exist.');

        const c = await Comment.create(commentToSave);

        await Comment.findByIdAndUpdate(commentId, {
            "$push": { "comments": c.id } 
        }).exec();

        return c;
    }
});

import Post from "models/Post";
import { AuthenticatedResolver } from "../Decorators";
import Community from "models/Community";
import Comment from "models/Comment";
import { ValidationError, UserInputError } from "apollo-server";
import User from "models/User";

export const postCreateOne = AuthenticatedResolver<{ title: string; body: string; communityId: string }>(async (_, { title, body, communityId }, { me, loaders  }) => {
    const communityObj = await Community.findOne({ _id: communityId }).exec();
    if (!communityObj) throw new ValidationError('Community does not exist.');

    const p = await Post.create({
        title,
        body,
        author: me.id,
        community: communityId
    });

    await User.findByIdAndUpdate(me.id, { posts: [ ...me.posts, p.id]});
    await Community.findByIdAndUpdate(communityObj.id, { posts: [ ...communityObj.posts, p.id]});

    await Post.batchData(loaders, [p])[0];
    return p;
});

export const communityCreateOne = AuthenticatedResolver<{ title: string }>(async (_, { title }, { me }) => {
    const community = await Community.findOne({ title });
    if (community) throw new UserInputError('Community name already used.');

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
        await Post.findByIdAndUpdate(postObj.id, { comments: [ ...postObj.comments, result.id]});
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

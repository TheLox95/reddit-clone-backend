import Post from "models/Post";
import User from "models/User";
import testUsers from "testData/users";
import testCommunities from "testData/communities";
import testComments from "testData/comments";
import testPosts from "testData/posts";
import { TestResolver } from "../Decorators";
import Community from "models/Community";
import Comment from "models/Comment";

export const resetDB = TestResolver(async () => {
    const users = await User.find().exec();
    await User.deleteMany({_id: {$in: users.map(u => u.id)}}).exec();

    const communities = await Community.find().exec();
    await Community.deleteMany({_id: {$in: communities.map(u => u.id)}}).exec();

    const posts = await Post.find().exec();
    await Post.deleteMany({_id: {$in: posts.map(u => u.id)}}).exec();

    const comments = await Comment.find().exec();
    await Comment.deleteMany({_id: {$in: comments.map(u => u.id)}}).exec();
    return true;
});

export const seedUsers = TestResolver(async () => {
    await Promise.all(testUsers.map(tu => User.create(tu)));
    return true;
});

export const seedCommunities = TestResolver(async () => {
    const users = await Promise.all(testUsers.map(tu => User.create(tu)));

    await Promise.all(testCommunities.map(async tc => {
        const j = {
            ...tc,
            author: users[Math.floor(Math.random() * 5)]._id,
            posts: await Promise.all(testPosts.slice(0, 2).map(async tu => {
                delete tu._id;
                const createdPost = await Post.create({ ...tu, community: tc._id, author: users[Math.floor(Math.random() * 9)]._id });
                const subComments = await Promise.all(testComments.map(tu => ({...tu, rootPost: createdPost.id, author: users[Math.floor(Math.random() * (8+1))]})).map(tu => Comment.create(tu)));
                const comments = await Promise.all(testComments.map(tu => ({...tu, rootPost: createdPost.id, comments: subComments.slice(0,Math.floor(Math.random() * (8+1))), author: users[Math.floor(Math.random() * (8+1))]})).map(tu => Comment.create(tu)));
                return Post.findByIdAndUpdate(createdPost.id, {comments});
            })),
        };
        return Community.create(j);
    }));
    return true;
});

export const seedPosts = TestResolver(async () => {
    await Promise.all(testPosts.map(async tp => {
        const coooo = await Promise.all(testComments.slice(1, 3).map(async (tc) => {
            const j = {
                ...tc,
                author: testUsers[Math.floor(Math.random() * 5)]._id,
                rootPost: tp._id,
            };
            const comment = await Comment.create(j);
            return comment.id;
        }));

        const j = {
            ...tp,
            author: testUsers[Math.floor(Math.random() * 5)]._id,
            community: testCommunities[Math.floor(Math.random() * 5)]._id,
            comments: coooo
        };
        return Post.create(j);
    }));
    return true;
});

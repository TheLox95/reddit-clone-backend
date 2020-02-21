import Post from "models/Post";
import User from "models/User";
import testUsers from "testData/users";
import testCommunities from "testData/communities";
import testPosts from "testData/posts";
import { Resolver } from "./Resolver";
import { sign } from 'jsonwebtoken';
import { UserInputError, AuthenticationError, ValidationError } from "apollo-server-express";
import { compare } from 'bcrypt';
import { TestResolver, AuthenticatedResolver } from "./Decorators";
import Community from "models/Community";
import Comment from "models/Comment";


export const postCreateOne: Resolver<{ title: string; body: string; authorId: number }> = (...args) => {
    const [, { title, body, authorId }] = args;
    return Post.create({
        title,
        body,
        author: authorId
    });
};

export const userCreateOne: Resolver<{ username: string; password: string; email: string }> = async (...args) => {
    const [, { username, password, email }] = args;
    
    const user = await User.create({
        username,
        password,
        email,
    });

    const { id } = user;
    const token = await sign({ id }, process.env.JWT_SECRET, { expiresIn: "30m" });
    return { token };
};

export const signIn: Resolver<{ login: string; password: string }> = async (...args) => {
    const [, { login, password }] = args;
    
    const user = await User.findOne({
        $or: [{ username: login }, { email: login }]
    }).select('+password').exec();

    if (!user) throw new UserInputError('No user found with this login credentials.');

    const isValid = await compare(password, user.password);

    if (!isValid) throw new AuthenticationError('Username or password incorrect');

    const { id } = user;
    const token = await sign({ id }, process.env.JWT_SECRET, { expiresIn: "30m" });
    return { token };
};

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
    await Promise.all(testCommunities.map(tc => {
        const j = { ...tc, author: testUsers[Math.floor(Math.random() * 5)]._id };
        return Community.create(j);
    }));
    return true;
});

export const seedPosts = TestResolver(async () => {
    await Promise.all(testPosts.map(tp => {
        const j = {
            ...tp,
            author: testUsers[Math.floor(Math.random() * 5)]._id,
            community: testCommunities[Math.floor(Math.random() * 5)]._id,
        };
        return Post.create(j);
    }));
    return true;
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

import Post from "models/Post";
import { Resolver } from "./Resolver";
import User from "models/User";
import Community from "models/Community";

export const posts: Resolver<{}> = () => Post.find().exec();
export const post: Resolver<{ id: string }> = (p, { id }) => Post.findOne({ _id: id }).exec();


export const user: Resolver<{ id: string }> = async (p, { id }) => {
    const u = await User.findOne({ _id: id }).exec();
    return u;
};

export const users: Resolver<{ offset?: number; limit?: number }> = async (p, { offset = 0, limit = 10 }) => {
    const u = await User.find().limit(limit).skip(offset).sort({date: 'desc'}).exec();
    return u;
};

export const community: Resolver<{ id: string }> = async (p, { id }, { loaders }) => {
    const c = await Community.findById(id).exec();
    c.author = await loaders.batchAuthors.load(c.author.toString());
    c.posts = await Promise.all(c.posts.map(p => loaders.batchPosts.load(p.id)));
    return c;
};

export const communities: Resolver<{ offset?: number; limit?: number }> = async (p, { offset = 0, limit = 10 }, { loaders }) => {

    let communities = await Community.find().limit(limit).skip(offset).sort({date: 'desc'}).exec();
    await Promise.all(communities.map(async c => {
        c.posts = await Promise.all(c.posts.map(p => loaders.batchPosts.load(p.id)));
        return c;
    }));
    communities = await Promise.all(communities
        .map(async c => {
            c.author = await loaders.batchAuthors.load(c.author.toString());
            return c;
        })
    );
    
    
    return communities;
};
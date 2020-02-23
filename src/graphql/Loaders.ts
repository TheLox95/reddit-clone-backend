import DataLoader from 'dataloader';
import User, { UserSchema } from 'models/User';
import Post, { PostSchema } from 'models/Post';

const batchAuthors = async (keys: string[]): Promise<UserSchema[]> => {
    const users = await User.find({ '_id': { $in: keys.map(k => k.toString() ) } });
    return keys.map(key => users.find(user => user.id === key));
};

const batchPosts = async (keys: string[]): Promise<PostSchema[]> => {
    const posts = await Post.find({ '_id': { $in: keys.map(k => k.toString() ) } });
    return keys.map(key => posts.find(post => post.id === key));
};

export interface Loaders {
    batchAuthors: DataLoader<string, UserSchema>;
    batchPosts: DataLoader<string, PostSchema>;
}

export default (): Loaders => ({
    batchAuthors: new DataLoader(batchAuthors),
    batchPosts: new DataLoader(batchPosts)
});

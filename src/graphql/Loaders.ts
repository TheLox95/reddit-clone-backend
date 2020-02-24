import DataLoader from 'dataloader';
import User, { UserSchema } from 'models/User';
import Post, { PostSchema } from 'models/Post';
import Comment, { CommentSchema } from 'models/Comment';

const batchAuthors = async (keys: string[]): Promise<UserSchema[]> => {
    const users = await User.find({ '_id': { $in: keys.map(k => k.toString() ) } });
    return keys.map(key => users.find(user => user.id === key));
};

const batchPosts = async (keys: string[]): Promise<PostSchema[]> => {
    const posts = await Post.find({ '_id': { $in: keys.map(k => k.toString() ) } });
    return keys.map(key => posts.find(post => post.id === key));
};

const batchComments = async (keys: string[]): Promise<CommentSchema[]> => {
    const comments = await Comment.find({ '_id': { $in: keys.map(k => k.toString() ) } });
    return keys.map(key => comments.find(post => post.id === key));
};

export interface Loaders {
    batchAuthors: DataLoader<string, UserSchema>;
    batchPosts: DataLoader<string, PostSchema>;
    batchComments: DataLoader<string, CommentSchema>;
}

export default (): Loaders => ({
    batchAuthors: new DataLoader(batchAuthors),
    batchPosts: new DataLoader(batchPosts),
    batchComments: new DataLoader(batchComments)
});

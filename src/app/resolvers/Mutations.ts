import Post, { PostSchema } from "models/Post";
import User, { UserSchema } from "models/User";
import testUsers from "testData/users";
import { Resolver } from "./Resolver";
import { sign } from 'jsonwebtoken';


export const postCreateOne: Resolver<{ title: string; body: string; authorId: number }, PostSchema> = (...args) => {
    const [, { title, body, authorId }] = args;
    return Post.create({
        title,
        body,
        author: authorId
    });
};

export const userCreateOne: Resolver<{ username: string; password: string; email: string }, { token: string }> = async (...args) => {
    const [, { username, password, email }] = args;
    
    const user = await User.create({
        username,
        password,
        email,
    });

    const { id } = user;
    const token = await sign({ id }, process.env.JWT_SECRET, { expiresIn: "30m" });
    console.log(token);
    return { token };
};

const testMutation = <A = {}>(cb: Resolver<A, boolean>): Resolver<A, boolean> => {
    if (process.env.NODE_ENV !== 'test') return (): Promise<boolean> => Promise.resolve(false as unknown as boolean);
    return (P, A, D): Promise<boolean> => cb(P, A, D);
};

export const resetDB: Resolver<{}, boolean> = testMutation(async () => {
    const users = await User.find().exec();

    await User.deleteMany({
        _id: {
            $in: users.map(u => u.id)
        }
    }).exec();

    return true;
});

export const seedUsers: Resolver<{}, boolean> = testMutation(async () => {
    await Promise.all(testUsers.map(tu => User.create(tu)));

    return true;
});
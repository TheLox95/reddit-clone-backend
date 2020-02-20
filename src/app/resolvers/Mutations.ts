import Post, { PostSchema } from "models/Post";
import User, { UserSchema } from "models/User";
import { Resolver } from "./Resolver";


export const postCreateOne: Resolver<{ title: string; body: string; authorId: number}, PostSchema> = (...args) => {
    const [, { title, body, authorId }] = args;
    return Post.create({
        title,
        body,
        author: authorId
    });
};

export const userCreateOne: Resolver<{ username: string; password: string; email: string }, UserSchema> = (...args) => {
    const [, { username, password, email } ] = args;
    return User.create({
        username,
        password,
        email,
    });
};
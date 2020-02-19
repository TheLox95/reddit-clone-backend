import Post from "models/Post";
import User from "models/User";

export const postCreateOne = (parent, { title, body, authorId }, { me }) => {
    return Post.create({
        title,
        body,
        author: authorId
    })
}

export const userCreateOne = (parent, { username, password, email }, { me }) => {
    return User.create({
        username,
        password,
        email,
    })
}
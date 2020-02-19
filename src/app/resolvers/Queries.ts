import Post from "models/Post";

export const posts = () => {
    return [{
        id: 33333,
        title: 'Post',
        body: 'nkjhkjhkjhkjhasfasd',
        comments: [],
        author: {
        }
    }];
}

export const post = (...args) => {
    console.log(args)
    return [{
        id: 5515,
        title: 'Post',
        body: 'nkjhkjhkjhkjhasfasd',
        comments: [],
        author: {
        }
    }];
}
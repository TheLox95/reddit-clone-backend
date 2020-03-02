import { gql } from "apollo-server-express";

const Schema = gql`
    type Query {
        posts(offset: Int, limit: Int): [Post!]!
        post(id: ID!): Post!
        communities(offset: Int, limit: Int): [Community!]!
        community(id: ID!): Community!
        users(offset: Int, limit: Int): [User!]!
        user(id: ID!): User!
        comment(id: ID!): Comment!
    }
    type Mutation {
        resetDB(id: ID): Boolean
        seedUsers(id: ID): Boolean
        seedCommunities(id: ID): Boolean
        seedPosts(id: ID): Boolean

        userCreateOne(username: String!, password: String!, email: String!): Token!
        postCreateOne(title: String!, body: String!, communityId: ID!): Post!
        communityCreateOne(title: String!): Community!
        commentCreateOne(body: String!, rootPostId: String!, postId: String, commentId: String): Comment!
        signIn(login: String!, password: String!): Token!
    }

    type Token {
        token: String!
    }

        type User{
            id: String!
            username: String!
            email: String!
            posts: [Post]!
        }
        
        type Post{
            id: ID!
            title: String!
            body: String!
            comments: [Comment]
            author: User!
            community: ID!
        }
        
        type Comment{
            id: ID!
            body: String!
            author: User!
            rootPost: ID!
            post: ID
            comments: [Comment]
        }
        
        type Community{
            id: ID!
            title: String!
            posts: [Post]
            author: User!
        }`;

export default Schema;
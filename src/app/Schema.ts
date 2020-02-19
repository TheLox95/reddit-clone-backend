import { gql } from "apollo-server-express";

const Schema = gql`
    type Query {
        posts(offset: Int, limit: Int): [Post!]!
        post(ID: ID!): Post!
        communities(offset: Int, limit: Int): [Community!]!
        community(ID: ID!): Community!
        users(offset: Int, limit: Int): [User!]!
        user(ID: ID!): User!
    }
    type Mutation {
        userCreateOne(username: String!, password: String!, email: String!): User!
        postCreateOne(title: String!, body: String!, authorId: String!): Post!
        communityCreateOne(title: String!): Community!
        commentCreateOne(body: String!, authorId: String!): Community!
    }

        type User{
            id: Int!
            username: String!
            password: String!
            email: String!
        }
        
        type Post{
            id: ID!
            title: String!
            body: String!
            comments: [Comment]
            author: User
        }
        
        type Comment{
            id: ID!
            body: String!
            author: User
        }
        
        type Community{
            id: ID!
            title: String!
            posts: [Post]
        }`;

export default Schema;
import { ApolloServer } from "apollo-server-express";
import Schema from "./Schema";
import resolvers from "./resolvers";

export const server = new ApolloServer({ typeDefs: Schema, resolvers, playground: process.env.NODE_ENV !== 'prod' });
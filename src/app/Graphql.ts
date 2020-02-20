import { ApolloServer, AuthenticationError } from "apollo-server-express";
import Schema from "./Schema";
import resolvers from "./resolvers";
import { verify } from "jsonwebtoken";
import { UserSchema } from "models/User";
import Context from "./resolvers/Context";

const getUser = async (req): Promise<UserSchema | null> => {
    const token = req.headers['Authorization'];
    if (token) {
      try {
        return await verify(token, process.env.SECRET) as UserSchema;
      } catch (e) {
        throw new AuthenticationError('Your session expired. Sign in again.');
      }
    }
    return null;
};

export const server = new ApolloServer({
    typeDefs: Schema,
    resolvers,
    playground: process.env.NODE_ENV !== 'prod',
    context: async ({ req }): Promise<Context> => {
        const me = await getUser(req);
        return { me };
    }
});
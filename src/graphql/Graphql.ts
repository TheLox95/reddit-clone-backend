import { ApolloServer, AuthenticationError } from "apollo-server-express";
import Schema from "./Schema";
import resolvers from "./resolvers";
import getLoaders from "./Loaders";
import { verify } from "jsonwebtoken";
import User, { UserSchema } from "models/User";
import Context from "./resolvers/Context";

const getUser = async (req): Promise<UserSchema | null> => {
  const token = req.headers['authorization'];
  if (token) {
    try {
      const data = await verify(token, process.env.JWT_SECRET) as UserSchema;
      return User.findById(data.id).exec();
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
    return { me, loaders: getLoaders() };
  },
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  formatError: (error) => {
    return error;
  }
});
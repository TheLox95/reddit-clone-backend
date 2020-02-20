import { ForbiddenError, IFieldResolver } from 'apollo-server';
import { skip, combineResolvers } from 'graphql-resolvers';
import { Resolver } from './Resolver';
import Context from './Context';

export const AuthenticatedResolver = (fn: Resolver): Resolver => combineResolvers<{}, Context, {}>(
    (_, __, { me }) => me ? skip : new ForbiddenError('Not authenticated as user.'),
    fn,
  );

export const TestResolver = (fn: IFieldResolver<{}, Context, {}>): IFieldResolver<{}, {}> => combineResolvers<{}, Context, {}>(
    () => process.env.NODE_ENV !== 'test' ? new ForbiddenError('Not in test mode') : skip,
    fn,
  );
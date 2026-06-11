const { UserResolver } = require('./UserResolver');

const rootResolvers = {
  Query: {
    ...UserResolver.Query,
    ...ArticleResolver.Query,
    ...CategoryResolver.Query,
  },
  Mutation: {
    ...UserResolver.Mutation,
    ...ArticleResolver.Mutation,
    ...CategoryResolver.Mutation,
  },
};

const resolvers = [
  UserResolver,
  ArticleResolver,
  CategoryResolver,
];

module.exports = { rootResolvers, resolvers };

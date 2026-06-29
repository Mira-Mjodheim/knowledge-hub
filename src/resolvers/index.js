const { UserResolver } = require('./UserResolver');
const KnowledgeResolver = require('./KnowledgeResolver');

const rootResolvers = {
  Query: {
    ...UserResolver.Query,
    ...KnowledgeResolver.Query,
  },
  Mutation: {
    ...UserResolver.Mutation,
    ...KnowledgeResolver.Mutation,
  },
};

const resolvers = [
  UserResolver,
  KnowledgeResolver,
];

module.exports = { rootResolvers, resolvers };

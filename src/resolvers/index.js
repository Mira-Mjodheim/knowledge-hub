```javascript
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { UserResolver } = require('./userResolver');
const { ArticleResolver } = require('./articleResolver');
const { CategoryResolver } = require('./categoryResolver');

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
```
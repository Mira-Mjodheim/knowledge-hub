const request = require('supertest');
const express = require('express');
const http = require('http');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const typeDefs = `
  type Knowledge {
    id: ID!
    title: String!
    content: String!
    createdAt: String
  }
  type User {
    id: ID!
    username: String!
    email: String!
  }
  type AuthPayload {
    token: String!
    user: User!
  }
  type Query {
    knowledges: [Knowledge]
    me: User
  }
  type Mutation {
    register(username: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    createKnowledge(title: String!, content: String!, authorId: ID!): Knowledge
  }
`;

const mockResolvers = {
  Query: {
    knowledges: () => [],
    me: (_, __, { user }) => user ? { id: '1', username: 'test', email: 'test@test.com' } : null,
  },
  Mutation: {
    login: () => null,
    register: () => null,
    createKnowledge: () => null,
  },
};

let mongoServer, app, httpServer, url;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  app = express();
  httpServer = http.createServer(app);

  const apollo = new ApolloServer({
    typeDefs,
    resolvers: mockResolvers,
  });
  await apollo.start();

  app.use('/graphql', express.json(), expressMiddleware(apollo));

  url = `http://localhost:${httpServer.address()?.port || 0}/graphql`;
  await new Promise((resolve) => httpServer.listen(0, resolve));
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  httpServer.close();
});

describe('KnowledgeHub API', () => {
  it('GET /graphql returns 400 (GET not allowed)', async () => {
    const res = await request(httpServer).get('/graphql');
    expect(res.status).toBe(400);
  });

  it('POST /graphql with introspect query works', async () => {
    const res = await request(httpServer)
      .post('/graphql')
      .send({ query: '{ __typename }' });
    expect(res.status).toBe(200);
    expect(res.body.data.__typename).toBe('Query');
  });

  it('knowledges query returns empty array', async () => {
    const res = await request(httpServer)
      .post('/graphql')
      .send({ query: '{ knowledges { id title } }' });
    expect(res.status).toBe(200);
    expect(res.body.data.knowledges).toEqual([]);
  });
});

require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const typeDefs = fs.readFileSync(path.join(__dirname, './schema.graphql'), 'utf8');
const { resolvers } = require('./resolvers');
const { verifyToken } = require('./utils/auth');

const app = express();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge-hub')
  .then(() => console.log('Connexion à MongoDB établie'))
  .catch((err) => console.error('Erreur de connexion à MongoDB', err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const header = req.headers.authorization || '';
    const token = header.replace('Bearer ', '');
    if (!token) return {};
    const user = verifyToken(token);
    return { user };
  },
});

server.applyMiddleware({ app });

const PORT = process.env.PORT || 4000;

app.listen({ port: PORT }, () => {
  console.log(`Server écoute sur le port ${PORT}`);
});

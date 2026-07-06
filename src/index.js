require('dotenv').config();
const express = require('express');
const http = require('http');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const typeDefs = fs.readFileSync(path.join(__dirname, './schema.graphql'), 'utf8');
const { resolvers } = require('./resolvers');
const { verifyToken } = require('./utils/auth');

const app = express();
const httpServer = http.createServer(app);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge-hub')
  .then(() => console.log('Connexion à MongoDB établie'))
  .catch((err) => console.error('Erreur de connexion à MongoDB', err));

async function start() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const header = req.headers.authorization || '';
        const token = header.replace('Bearer ', '');
        if (!token) return {};
        const user = verifyToken(token);
        return { user };
      },
    })
  );

  const PORT = process.env.PORT || 4000;
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server prêt sur http://localhost:${PORT}/graphql`);
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

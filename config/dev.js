```
module.exports = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/knowledgehub-dev',
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET || 'secret-dev',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  CORS_METHODS: process.env.CORS_METHODS || 'GET, POST, PUT, DELETE, OPTIONS',
  CORS_HEADERS: process.env.CORS_HEADERS || 'Content-Type, Authorization',
};
```
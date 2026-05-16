```javascript
const path = require('path');
const { merge } = require('lodash');
const devConfig = require('./config/dev');
const prodConfig = require('./config/prod');

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  db: {
    uri: process.env.DB_URI || 'mongodb://localhost:27017/knowledgehub',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  graphql: {
    schema: path.join(__dirname, 'src', 'schema.graphql'),
    playground: {
      enabled: true,
      endpoint: '/graphql',
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: '1h',
  },
};

const envConfig = config.env === 'production' ? prodConfig : devConfig;

module.exports = merge(config, envConfig);
```
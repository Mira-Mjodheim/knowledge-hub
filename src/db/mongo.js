const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledgehub';

const connectDB = async () => {
  try {
    const client = new MongoClient(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();

    return { db, client };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

const mongoose = require('mongoose');

const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/vibe-shopping';
const resolveMongoUri = () => {
  const uri = (process.env.MONGODB_URI || process.env.VITE_MONGODB_URI || '').trim();
  return uri || LOCAL_MONGODB_URI;
};

const connectWithUri = async (uri) => {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    family: 4,
  });
};

const connectDB = async () => {
  const uri = resolveMongoUri();
  const useLocalOnly = uri === LOCAL_MONGODB_URI;

  if (!useLocalOnly) {
    try {
      await connectWithUri(uri);
      console.log('MongoDB connected (remote)');
      return;
    } catch (error) {
      console.warn(`MongoDB remote connection failed: ${error.message}`);
      console.warn(`Falling back to local database: ${LOCAL_MONGODB_URI}`);

      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    }
  }

  try {
    await connectWithUri(LOCAL_MONGODB_URI);
    console.log('MongoDB connected (local)');
  } catch (error) {
    throw new Error(
      `Local MongoDB connection failed: ${error.message}. `
      + 'Start local MongoDB or check your MONGODB_URI in client/.env.',
    );
  }
};

module.exports = connectDB;

import mongoose from 'mongoose';
import { env } from '../utils/env.js';
import { MONGO_VARS } from '../constants/index.js';

export const initMongoConnection = async () => {
  try {
    const user = env(MONGO_VARS.MONGODB_USER);
    const pwd = env(MONGO_VARS.MONGODB_PASSWORD);
    const url = env(MONGO_VARS.MONGODB_URL);
    const db = env(MONGO_VARS.MONGODB_DB, '');

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    );
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('Error while setting up mongo connection\n', e);
    process.exit(1);
    throw e;
  }
};

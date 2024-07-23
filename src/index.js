import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { createDirIfNotexists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

const bootstrap = async () => {
  try {
    await initMongoConnection();
    await createDirIfNotexists(TEMP_UPLOAD_DIR);
    await createDirIfNotexists(UPLOAD_DIR);
    setupServer();
  } catch (error) {
    console.error('Failed to start server:', error.message);
  }
};

void bootstrap();

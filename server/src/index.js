import dotenv from 'dotenv';
import http from 'http';
import app from './app.js';
import { connectToDatabase } from './config/db.js';
import { appLogger } from './config/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectToDatabase();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      appLogger.info(`Server running on port ${PORT}`);
    });

    process.on('unhandledRejection', (reason) => {
      appLogger.error(`Unhandled Rejection: ${reason}`);
    });

    process.on('uncaughtException', (err) => {
      appLogger.error(`Uncaught Exception: ${err.message}`);
      process.exit(1);
    });
  } catch (err) {
    appLogger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
}

startServer();



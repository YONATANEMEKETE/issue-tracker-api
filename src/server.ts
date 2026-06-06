import { config } from './shared/configs/env.js';
import { app } from './app.js';
import { logger } from './shared/configs/logger.js';
import { prisma } from './shared/db/prisma.js';

const gracefulShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

  // 1. Close PostgreSQL pool and Prisma connection
  try {
    await prisma.$disconnect();
    console.log('Prisma disconnected.');
  } catch (err) {
    console.error('Error disconnecting Prisma:', err);
  }
  // 2. Terminate process
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

app.listen(config.PORT, () => {
  logger.info(
    `Server is running on port ${config.PORT}, http://localhost:${config.PORT}`,
  );
});

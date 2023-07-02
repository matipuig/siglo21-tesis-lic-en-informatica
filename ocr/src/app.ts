/**
 *  @packageDocumentation
 *  @hidden
 *  Import and connect the required DBs in start().
 *  Also, close that database in end().
 */
import express from 'express';

import api from './api';
import CONFIG from './config';
import files from './controller/files';
import sequelize from './model/db/sequelize';
import textractor from './controller/textractor';
import { logger, LABELS } from './utils/logger';

const app = express();

const start = async function start(): Promise<boolean> {
  try {
    await sequelize.sync({});

    app.set('trust-proxy', true);
    app.use(api);
    app.emit('started');
    logger.info('App started...', LABELS.INFO.APP_PROCESS);

    await files.updateStartedsToNotStarted();
    await textractor.processNextFile();
  } catch (error) {
    logger.error(error, LABELS.ERROR.STARTING, { error });
    throw error;
  }
  return true;
};

const end = async function end(): Promise<boolean> {
  try {
    await sequelize.close();
  } catch (error) {
    logger.error(error, LABELS.ERROR.EXITING, { error });
  }

  logger.info(`Exiting ${CONFIG.APP_NAME}...`, LABELS.INFO.APP_PROCESS);
  return true;
};

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection.', LABELS.ERROR.PROCESS_ON, { reason, promise });
  throw new Error('Unhandled rejection');
});
process.on('uncaughtException', (error) => {
  logger.error(error.message, LABELS.ERROR.PROCESS_ON, { error });
  throw error;
});
process.on('exit', end);
start();

export default app;

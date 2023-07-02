/**
 *  @packageDocumentation
 *  @hidden
 *  Import and connect the required DBs in start().
 *  Also, close that database in end().
 */

import express from 'express';

import CONFIG from './config';
import CONSTS from './constants';
import logger from './utils/logger';
import api from './api';

const app = express();

const start = async function start(): Promise<boolean> {
  try {
    app.set('trust-proxy', true);
    app.use(api);
    app.emit('started');
    logger.info('App started...', CONSTS.LOGS.LABELS.INFO.APP_PROCESS);
  } catch (error) {
    logger.error(error, CONSTS.LOGS.LABELS.ERROR.STARTING, { error });
    throw error;
  }
  return true;
};

const end = async function end(): Promise<boolean> {
  logger.info(`Exiting ${CONFIG.APP_NAME}...`, CONSTS.LOGS.LABELS.INFO.APP_PROCESS);
  return true;
};

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection.', CONSTS.LOGS.LABELS.ERROR.PROCESS_ON, { reason, promise });
  throw new Error('Unhandled rejection');
});

process.on('uncaughtException', (error) => {
  logger.error(error.message, CONSTS.LOGS.LABELS.ERROR.PROCESS_ON, { error });
  throw error;
});

process.on('exit', end);
start();

export default app;

import express from 'express';

import api from './api';
import filesProcessor from './controller/filesProcessor';
import loader from './controller/loader';
import sequelize from './model/db/sequelize';
import './model/orm';

const app = express();

const start = async function start(): Promise<boolean> {
  try {
    app.set('trust-proxy', true);
    app.use(api);
    app.emit('started');
    await sequelize.sync({});
    filesProcessor.start();
    loader.start();
    console.log('Aplicación iniciada...');
  } catch (error) {
    throw error;
  }
  return true;
};

const end = async function end(): Promise<boolean> {
  console.log(`Exiting extractor...`);
  return true;
};

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection.');
  console.error(reason);
});

process.on('exit', end);
start();

export default app;

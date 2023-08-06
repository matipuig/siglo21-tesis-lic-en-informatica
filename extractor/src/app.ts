import express from 'express';

import api from './api';

const app = express();

const start = async function start(): Promise<boolean> {
  try {
    app.set('trust-proxy', true);
    app.use(api);
    app.emit('started');
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

import express from 'express';

import sequelize from './model/db/sequelize';
import users from './controller/users';
import './model/orm';
import getAPI from './api';
import searchersDAO from './model/actions/searchersDAO';

const app = express();

const start = async function start(): Promise<boolean> {
  try {
    app.set('trust-proxy', true);
    app.emit('started');
    await sequelize.sync({});
    await users.set('matias', '12345', 'Matias Puig');
    const searchers = await searchersDAO.getAll();
    const api = getAPI(searchers);
    app.use(api);
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

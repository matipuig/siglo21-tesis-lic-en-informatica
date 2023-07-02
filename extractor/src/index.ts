/**
 *  @packageDocumentation
 *  @hidden
 *  Starts the server listening to a port.
 */

import fs from 'fs';
import http from 'http';
import https from 'https';

import CONFIG from './config';
import CONSTS from './constants';
import app from './app';
import logger from './utils/logger';

let server;

if (CONFIG.SSL.USE) {
  const credentials = {
    key: fs.readFileSync(CONFIG.SSL.KEY_PATH, 'utf8'),
    cert: fs.readFileSync(CONFIG.SSL.CERT_PATH, 'utf8'),
  };
  server = https.createServer(credentials, app);
} else {
  server = http.createServer(app);
}

server.listen(CONFIG.PORT);
logger.info(
  `${CONFIG.APP_NAME} listening on port ${CONFIG.PORT}...`,
  CONSTS.LOGS.LABELS.INFO.APP_PROCESS,
);

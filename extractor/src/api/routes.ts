/**
 *  @packageDocumentation
 *  @module API/Routes
 *  API routes for every API.
 */

import express, { Request, Response } from 'express';
import { noop } from 'lodash';

import apiUtils from './apiUtils';
import extractor from './handlers/extractor';
import ROUTES from '~/constants/routes';

const api = express.Router();

api.get(ROUTES.API.TESTING, (req: Request, res: Response): boolean => {
  noop(req);
  return apiUtils.sendResponse(res, true);
});

/**
 * Routes.
 */
api.get(ROUTES.API.EXTRACTOR.FROM_URL, extractor.getFromURL);
api.post(ROUTES.API.EXTRACTOR.FROM_BASE64, extractor.getFromBase64);

/**
 *  Error handling.
 */
api.all('*', apiUtils.sendMethodNotFound);
api.use(apiUtils.handleError);

export default api;

/**
 *  @packageDocumentation
 *  @module API/Routes
 *  API routes for every API.
 */

import { noop } from 'lodash';
import express, { Request, Response } from 'express';

import auth from './auth';
import CONFIG from '~/config';
import ROLES from '~/constants/roles';
import apiUtils from './apiUtils';
import ROUTES from '~/constants/routes';

import ocrFilesHandler from './handlers/ocrFiles';
import textractorHandler from './handlers/textractor';

const api = express.Router();

/**
 *  Testing.
 *  NOTE: Do NOT delete this route, because it's used to test.
 */
if (CONFIG.AUTH.USE_JWT) {
  api.use(auth.stopRequestsWithoutAnyRoles([ROLES.TESTING]));
}
api.get(ROUTES.API.TESTING, (req: Request, res: Response): boolean => {
  noop(req);
  return apiUtils.sendResponse(res, true);
});

// OCR FILES SERVICES
api.get(ROUTES.API.OCR_FILES.GET_FROM_HASH, ocrFilesHandler.getFromHash);
api.get(ROUTES.API.OCR_FILES.GET_GLOBAL_STATE, ocrFilesHandler.getGlobalState);
api.get(ROUTES.API.OCR_FILES.GET_ERRORED, ocrFilesHandler.getErrored);
api.post(ROUTES.API.OCR_FILES.RESET_ERRORED, ocrFilesHandler.resetErrored);
api.post(ROUTES.API.OCR_FILES.GET_STATES_FROM_HASHES, ocrFilesHandler.getManyStatesFromHashes);
api.delete(ROUTES.API.OCR_FILES.DELETE_BY_HASH, ocrFilesHandler.deleteByHash);

// TEXTRACTOR SERVICES.
api.post(ROUTES.API.TEXTRACTOR.FROM_BASE_64, textractorHandler.getFromBase64);

/**
 *  Error handling.
 */
api.all('*', apiUtils.sendMethodNotFound);
api.use(apiUtils.handleError);

export default api;

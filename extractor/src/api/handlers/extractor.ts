/**
 *  @packageDocumentation
 *  @module API/Handlers/Extractor
 *  API Handler for the extractor.
 */
import { Request, Response, NextFunction } from 'express';

import apiUtils from '~/api/apiUtils';
import schemas from '~/api/schemas';
import extractor from '~/controller/extractor';

/**
 *  API handler for the extractor.
 */
class ExtractorAPI {
  /**
   *  Get the text form the base64.
   *  @param req Express Request object.
   *  @param res Express Response object.
   *  @param next next Express NextFunction object.
   */
  async getFromBase64(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    let result;
    try {
      const body = await schemas.validate(req.body, 'EXTRACTOR');
      result = await extractor.extractFromBase64(<string>body.base64);
    } catch (error) {
      next(error);
      return false;
    }
    return apiUtils.sendResponse(res, { textContent: result });
  }

  /**
   *  Get the text form the URL.
   *  @param req Express Request object.
   *  @param res Express Response object.
   *  @param next next Express NextFunction object.
   */
  async getFromURL(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    const queryUrl = <string>req.query.url || '';
    const url = decodeURIComponent(queryUrl);
    let result;
    try {
      result = await extractor.extractFromURL(url);
    } catch (error) {
      next(error);
      return false;
    }
    return apiUtils.sendResponse(res, { textContent: result });
  }
}

export default new ExtractorAPI();

/**
 *  @packageDocumentation
 *  @module API/Handlers/Textractor
 *  AIP Handler for Textractor.
 */
import { Request, Response, NextFunction } from 'express';

import apiUtils from '~/api/apiUtils';
import schemas from '~/api/schemas';
import textractor from '~/controller/textractor';

/**
 *  API handler for the textractor.
 */
class TextractorAPI {
  /**
   *  Extract text from base64.
   *  @param req Express Request object.
   *  @param res Express Response object.
   *  @param next next Express NextFunction object.
   */
  async getFromBase64(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      const input = await schemas.validate(req.body, 'FROM_BASE_64');
      const result = await textractor.extractFromBase64(<string>input.base64);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }
}

export default new TextractorAPI();

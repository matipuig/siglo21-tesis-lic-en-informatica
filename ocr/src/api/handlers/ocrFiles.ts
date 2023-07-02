/**
 *  @packageDocumentation
 *  @module API/Handlers/Files
 *  API Handler for OCR files.
 */
import { Request, Response, NextFunction } from 'express';
import { noop } from 'lodash';

import apiUtils from '~/api/apiUtils';
import files from '~/controller/files';
import schemas from '~/api/schemas';

/**
 *  API Handler for OCR files.
 */
class OCRFilesAPI {
  /**
   *  Gets the global state of files.
   *  @param req Express Request object.
   *  @param res Express Response object.
   *  @param next next Express NextFunction object.
   */
  async getGlobalState(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      noop(req);
      const result = await files.getGlobalState();
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }

  /**
   *  Gets the file from its hash.
   *  @param req Express Request object.
   *  @param res Express Response object.
   *  @param next next Express NextFunction object.
   */
  async getFromHash(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      const { hash } = req.params;
      const result = await files.getFromHash(hash);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }

  /**
   *  Gets the states from theis hashes.
   *  @param req Express Request object.
   *  @param res Express Response object.
   *  @param next next Express NextFunction object.
   */
  async getManyStatesFromHashes(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      const input = await schemas.validate(req.body, 'HASHES');
      const hashes = <string[]>input.hashes;
      const result = await files.getManyStatesByHash(hashes);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }

  /**
   *  Gets the errored OCR files.
   *  @param req Express Request object.
   *  @param res Express Response object.
   *  @param next next Express NextFunction object.
   */
  async getErrored(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      noop(req);
      const result = await files.getErrored();
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }

  /**
   * Deletes the files with the specified hashes.
   * @param req Express Request object.
   * @param res Express Response object.
   * @param next next Express NextFunction object.
   */
  async deleteByHash(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      const body = await schemas.validate(req.body, 'HASHES');
      const result = await files.deleteByHash(<string[]>body.hashes);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }

  /**
   * Restarts the errored files.
   * @param req Express Request object.
   * @param res Express Response object.
   * @param next next Express NextFunction object.
   */
  async resetErrored(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      noop(req);
      await files.resetErrored();
      return apiUtils.sendResponse(res, true);
    } catch (error) {
      next(error);
      return false;
    }
  }
}

export default new OCRFilesAPI();

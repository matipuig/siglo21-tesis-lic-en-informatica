import { Request, Response, NextFunction } from 'express';
import { noop } from 'lodash';

type APIResponse = {
  success: boolean;
  error?: string;
  errorCode?: string;
  payload?: unknown;
  reload?: boolean;
};

class APIUtils {
  constructor() {
    this.handleError = this.handleError.bind(this);
  }

  sendResponse(res: Response, payload: unknown, code = 200): boolean {
    const send: APIResponse = {
      payload,
      success: true,
    };
    res.statusCode = code;
    res.json(send);
    return true;
  }

  sendError(req: Request, res: Response, error: Error, code = 500): boolean {
    noop(req);
    const response: APIResponse = {
      success: false,
      error: error.message,
      errorCode: error.name,
    };
    res.statusCode = code;
    res.json(response);
    return false;
  }

  sendMethodNotFound(req: Request, res: Response, next: NextFunction): boolean {
    noop([res]);
    const error = new Error(`No se encontró el método ${req.originalUrl}`);
    next(error);
    return true;
  }

  handleError(error: Error, req: Request, res: Response, next: NextFunction): void {
    noop(next);
    this.sendError(req, res, error, 503);
  }
}

export default new APIUtils();

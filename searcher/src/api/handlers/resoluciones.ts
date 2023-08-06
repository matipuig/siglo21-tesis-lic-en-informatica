import { noop, omit } from 'lodash';

import apiUtils from '~/api/apiUtils';
import schemas from '~/api/schemas';
import resoluciones from '~/controller/resoluciones';
import { NewResolucionType, SearchType } from '~/types/Resolucion';

class ResolucionesHandler {
  async getColumnValues(req: any, res: any, next: any): Promise<boolean> {
    try {
      noop(req);
      const result = await resoluciones.getColumnValues();
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }

  async find(req: any, res: any, next: any): Promise<boolean> {
    try {
      const searchParams = await schemas.validate(req.body as Record<string, string>, 'SEARCH');
      const result = await resoluciones.find(searchParams as SearchType);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }

  async findWithCount(req: any, res: any, next: any): Promise<boolean> {
    try {
      const searchParams = await schemas.validate(req.body as Record<string, string>, 'SEARCH');
      const result = await resoluciones.findWithCount(searchParams as SearchType);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }

  async upsert(req: any, res: any, next: any): Promise<boolean> {
    try {
      const resolucion = await schemas.validate(req.body as Record<string, string>, 'RESOLUCION');
      const { year, subject } = resolucion.metadata as Record<string, string>;
      const parsedResolucion = { ...omit(resolucion, 'metadata'), year, subject };
      const result = await resoluciones.upsert(parsedResolucion as unknown as NewResolucionType);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }

  async getFile(req: any, res: any, next: any): Promise<void> {
    try {
      const { id } = req.params;
      const { fileHash, fileName } = await resoluciones.getById(id);
      const buffer = resoluciones.getFile(fileHash);
      const contentType = 'application/pdf';
      const disposition = 'inline';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-disposition': `${disposition};filename=${fileName}`,
        'Content-Length': buffer.length,
      });
      res.end(buffer);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: any, res: any, next: any): Promise<boolean> {
    try {
      const { id } = req.params;
      const result = await resoluciones.delete(id);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }
}

export default new ResolucionesHandler();

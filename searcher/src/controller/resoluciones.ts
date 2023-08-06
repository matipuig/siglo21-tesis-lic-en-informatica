import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import ResolucionesDAO, { ColumnValueTypes, SearchResult } from '~/model/actions/ResolucionesDAO';

import { DBResolucionType, NewResolucionType, SearchType } from '~/types/Resolucion';

type FindWithCountResultType = {
  find: SearchResult;
  count: number;
};

const RESOLUCIONES_PATH = path.join(__dirname, '..', '..', 'persisted');

class Resoluciones {
  async getById(id: number): Promise<DBResolucionType> {
    return ResolucionesDAO.getById(id);
  }

  async getColumnValues(): Promise<ColumnValueTypes> {
    return ResolucionesDAO.getColumnValues();
  }

  async upsert(resolucion: NewResolucionType): Promise<DBResolucionType> {
    try {
      const { sourceId, fileName, year, subject, base64, textContent } = resolucion;
      const fileHash = crypto.createHash('sha256').update(base64).digest('hex');
      const filePath = path.join(RESOLUCIONES_PATH, fileHash);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, base64, { encoding: 'base64' });
      }
      const resolucionData = { sourceId, fileName, fileHash, year, subject, textContent };
      return ResolucionesDAO.upsert(resolucionData);
    } catch (error) {
      throw error;
    }
  }

  getFile(fileHash: string): Buffer {
    const filePath = path.join(RESOLUCIONES_PATH, fileHash);
    if (!fs.existsSync(filePath)) {
      throw new Error(`No se pudo encontrar el archivo de hash ${fileHash}`);
    }
    return fs.readFileSync(filePath, { encoding: null });
  }

  async find(search: SearchType): Promise<SearchResult> {
    return ResolucionesDAO.find(search);
  }

  async findWithCount(search: SearchType): Promise<FindWithCountResultType> {
    try {
      return {
        find: await ResolucionesDAO.find(search),
        count: await ResolucionesDAO.count(search),
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(sourceId: string): Promise<boolean> {
    return ResolucionesDAO.delete(sourceId);
  }
}

export default new Resoluciones();

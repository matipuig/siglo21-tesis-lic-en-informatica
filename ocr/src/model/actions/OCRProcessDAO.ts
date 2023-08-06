import handleError from '~/model/handleError';
import OCRProcessORM from '~/model/orm/OCRProcess';

import { OCRProcessType, DBOCRProcessType } from '~/types/OCRProcess';

class OCRProcessDAO {
  async getState(hash: string): Promise<DBOCRProcessType | false> {
    try {
      const lookedFile = await OCRProcessORM.findOne({ where: { hash } });
      if (!lookedFile) {
        return false;
      }
      return lookedFile.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }

  async add(hash: string, metadata: string): Promise<DBOCRProcessType> {
    try {
      const existingFile = await this.getState(hash);
      if (existingFile) {
        return existingFile;
      }
      const fileInfo: OCRProcessType = {
        hash,
        metadata,
        state: 'NOT_STARTED',
      };
      const newFile = await OCRProcessORM.create(fileInfo);
      return newFile.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }

  async getFirstNotStartedFile(): Promise<DBOCRProcessType | false> {
    try {
      const notStartedFile = await OCRProcessORM.findOne({
        where: { state: 'NOT_STARTED' },
      });
      if (!notStartedFile) {
        return false;
      }
      return notStartedFile.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }

  async setStartedToNotStarted(): Promise<void> {
    try {
      await OCRProcessORM.update({ state: 'NOT_STARTED' }, { where: { state: 'STARTED ' } });
    } catch (error) {
      throw error;
    }
  }

  async setStarted(hash: string): Promise<boolean> {
    const update = {
      state: 'STARTED',
      extractionStartedAt: new Date(),
    };
    return this._updateByHash(hash, update);
  }

  async setErrored(hash: string, error: string): Promise<boolean> {
    const update = {
      error,
      state: 'ERRORED',
    };
    return this._updateByHash(hash, update);
  }

  async setFinished(hash: string, text: string): Promise<boolean> {
    const update = {
      text,
      state: 'FINISHED',
    };
    return this._updateByHash(hash, update);
  }

  private async _updateByHash(hash: string, update: Partial<OCRProcessType>): Promise<boolean> {
    try {
      await OCRProcessORM.update(update, { where: { hash } });
    } catch (err) {
      return handleError(err);
    }
    return true;
  }
}

export default new OCRProcessDAO();

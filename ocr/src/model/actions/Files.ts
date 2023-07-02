/**
 *  @packageDocumentation
 *  @module Model/Actions/Mongo
 *  Interacts with sample mongoose model.
 */
import { values } from 'lodash';
import { Op } from 'sequelize';

import CONSTANTS from '~/constants';
import OCR_FILES from '~/constants/ocrFile';
import handleError from '~/model/handleError';
import FileModel from '~/model/orm/File';

import { FileType } from '~/types/File';

export type HashWithStateType = {
  hash: string;
  state: string | false;
};

/**
 *  Actions on the files database model.
 */
class FilesActions {
  /**
   *  Gets the state of the files.
   */
  async getGlobalState(): Promise<Record<string, number>> {
    try {
      const possibleValues = values(CONSTANTS.OCR_FILES.STATES);
      const statusPromises = possibleValues.map((state) => FileModel.count({ where: { state } }));
      const statuses = await Promise.all(statusPromises);

      const result: Record<string, number> = {};
      possibleValues.forEach((key, index) => {
        result[key] = statuses[index];
      });
      return result;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   *  Get the file information from a hash.
   *  @param hash Hash we are looking for.
   */
  async getFromHash(hash: string): Promise<FileType | false> {
    try {
      const lookedFile = await FileModel.findOne({ where: { hash } });
      if (!lookedFile) {
        return false;
      }
      await this._updateByHash(hash, {});
      return lookedFile.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   *  Retuurns the hashes with the state (or false if not found).
   *  @param hashes Hashes we are looking for.
   */
  async getManyStatesByHashes(hashes: string[]): Promise<HashWithStateType[]> {
    try {
      const searchedFiles = await FileModel.findAll({
        attributes: ['hash', 'state'],
        where: { hash: { [Op.in]: hashes } },
      });
      if (!searchedFiles) {
        return hashes.map((hash) => ({ hash, state: false }));
      }

      const results = searchedFiles.map((e) => e.get({ plain: true }));
      const foundHashes = results.map((e) => e.hash);
      const missingHashes = hashes.filter((e) => !foundHashes.includes(e));
      const missingResults = missingHashes.map((hash) => ({ hash, state: false }));
      return [...results, ...missingResults];
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * Gets the hashes of the errored files.
   */
  async getErrored(): Promise<string[]> {
    try {
      const rawErroredFiles = await FileModel.findAll({
        attributes: ['hash'],
        where: { state: OCR_FILES.STATES.ERRORED },
      });
      return rawErroredFiles.map((e) => e.get({ plain: true }).hash);
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   *  Gets the first not started file.
   */
  async getFirstNotStartedFile(): Promise<FileType | false> {
    try {
      const notStartedFile = await FileModel.findOne({
        where: { state: OCR_FILES.STATES.NOT_STARTED },
      });
      if (!notStartedFile) {
        return false;
      }
      return notStartedFile.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   *  Adds a hash to the database and returns its content.
   *  @param sample Sample to be added.
   */
  async add(hash: string): Promise<FileType> {
    try {
      const existingFile = await this.getFromHash(hash);
      if (existingFile) {
        return existingFile;
      }

      const fileInfo: FileType = {
        hash,
        state: OCR_FILES.STATES.NOT_STARTED,
        lastAskingDate: new Date(),
      };
      const newFile = await FileModel.create(fileInfo);
      return newFile.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   *  Sets the file as started.
   *  @param hash Hash from the file as errored.
   *  @param error Error that happened.
   */
  async setStarted(hash: string): Promise<boolean> {
    const update = {
      state: OCR_FILES.STATES.STARTED,
      extractionStartedAt: new Date(),
      percentageCompleted: 0,
    };
    return this._updateByHash(hash, update);
  }

  /**
   *  Sets the file as errored.
   *  @param hash Hash from the file as errored.
   *  @param error Error that happened.
   */
  async setErrored(hash: string, error: string): Promise<boolean> {
    const update = {
      error,
      state: OCR_FILES.STATES.ERRORED,
    };
    return this._updateByHash(hash, update);
  }

  /**
   *  Sets the file percentage completed.
   *  @param hash Hash from the file as errored.
   *  @param percentageCompleted Percentage completed.
   */
  async setPercentageCompleted(hash: string, percentageCompleted: number): Promise<boolean> {
    const update = {
      percentageCompleted,
      state: OCR_FILES.STATES.STARTED,
    };
    return this._updateByHash(hash, update);
  }

  /**
   *  Sets the file as finished.
   *  @param hash Hash from the file as finished.
   *  @param text Text of the file.
   */
  async setFinished(hash: string, text: string): Promise<boolean> {
    const update = {
      text,
      state: OCR_FILES.STATES.FINISHED,
      percentageCompleted: 100,
      extractedAt: new Date(),
    };
    return this._updateByHash(hash, update);
  }

  /**
   *  Updates the pendings to not started.
   */
  async updateStartedsToNotStarted(): Promise<boolean> {
    try {
      const { STARTED, NOT_STARTED } = OCR_FILES.STATES;
      const finalState = {
        state: NOT_STARTED,
        percentageCompleted: 0,
      };
      await FileModel.update(finalState, { where: { state: STARTED } });
    } catch (err) {
      return handleError(err);
    }
    return true;
  }

  /**
   *  Deletes the files with the specified hashes.
   *  @param hashes Hashes to delete.
   */
  async deleteByHash(hashes: string[]): Promise<number> {
    try {
      return await FileModel.destroy({ where: { hash: { [Op.in]: hashes } } });
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   *  Deletes the specified files by their last asking date until a specified date.
   *  @param date Until which date to ask.
   */
  async deleteUntilLastAskingDate(date: Date): Promise<boolean> {
    try {
      await FileModel.destroy({ where: { lastAskingDate: { [Op.lt]: date } } });
      return true;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * Sets the errored to not started.
   */
  async resetErrored(): Promise<boolean> {
    try {
      const { ERRORED, NOT_STARTED } = OCR_FILES.STATES;
      const finalState = {
        state: NOT_STARTED,
        percentageCompleted: 0,
        error: null,
        extractionStartedAt: null,
      };
      await FileModel.update(finalState, { where: { state: ERRORED } });
      return true;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   *  Empties the specified collection.
   */
  async empty(): Promise<boolean> {
    try {
      await FileModel.truncate();
    } catch (error) {
      throw error;
    }
    return true;
  }

  /**
   *  Drops the collection (use with care!!).
   */
  async drop(): Promise<boolean> {
    try {
      await FileModel.drop();
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * PRIVATE METHODS
   *
   */

  /**
   * Updates the state of a file by its hash.
   * @param hash Hash of the file.
   * @param update State to update.
   */
  private async _updateByHash(hash: string, update: Partial<FileType>): Promise<boolean> {
    const newState = {
      lastAskingDate: new Date(),
      ...update,
    };
    try {
      await FileModel.update(newState, { where: { hash } });
    } catch (err) {
      return handleError(err);
    }
    return true;
  }
}

export default new FilesActions();

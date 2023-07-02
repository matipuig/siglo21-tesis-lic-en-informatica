/**
 *  @packageDocumentation
 *  @module Controller/File
 *  Controller to manage files in OCR.
 */

import fileActions, { HashWithStateType } from '~/model/actions/Files';
import { FileType } from '~/types/File';

/**
 *  Actions on the files.
 */
class Files {
  /**
   * Gets the state of the files.
   */
  async getGlobalState(): Promise<Record<string, number>> {
    return fileActions.getGlobalState();
  }

  /**
   * Get the file information from a hash.
   * @param hash Hash we are looking for.
   */
  async getFromHash(hash: string): Promise<FileType | false> {
    return fileActions.getFromHash(hash);
  }

  /**
   * Returns hashes with states types.
   * @param hashes Hashes we are looking for.
   */
  async getManyStatesByHash(hashes: string[]): Promise<HashWithStateType[]> {
    return fileActions.getManyStatesByHashes(hashes);
  }

  /**
   *  Gets the next not started file.
   */
  async getFirstNotStartedFile(): Promise<FileType | false> {
    return fileActions.getFirstNotStartedFile();
  }

  /**
   * Gets the hashes of the errored files.
   */
  async getErrored(): Promise<string[]> {
    return fileActions.getErrored();
  }

  /**
   *  Adds a hash to the database and returns its content.
   *  @param sample Sample to be added.
   */
  async add(hash: string): Promise<FileType> {
    return fileActions.add(hash);
  }

  /**
   *  Sets the file as started.
   *  @param hash Hash from the file as errored.
   */
  async setStarted(hash: string): Promise<boolean> {
    return fileActions.setStarted(hash);
  }

  /**
   *  Sets the file as errored.
   *  @param hash Hash from the file as errored.
   *  @param error Error that happened.
   */
  async setErrored(hash: string, error: string): Promise<boolean> {
    return fileActions.setErrored(hash, error);
  }

  /**
   *  Sets the file percentage completed.
   *  @param hash Hash from the file.
   *  @param percentageCompleted Percentage completed.
   */
  async setPercentageCompleted(hash: string, percentage: number): Promise<boolean> {
    return fileActions.setPercentageCompleted(hash, percentage);
  }

  /**
   *  Sets the file as finished.
   *  @param hash Hash from the file as finished.
   *  @param text Text of the file.
   */
  async setFinished(hash: string, text: string): Promise<boolean> {
    return fileActions.setFinished(hash, text);
  }

  /**
   *  Changes the pending files to not started.
   */
  async updateStartedsToNotStarted(): Promise<boolean> {
    return fileActions.updateStartedsToNotStarted();
  }

  /**
   * Deletes the files with the specified hashes.
   * @param hashes Hashes of the files to delete.
   */
  async deleteByHash(hashes: string[]): Promise<number> {
    return fileActions.deleteByHash(hashes);
  }

  /**
   *  Deletes the specified files by their last asking date until a specified date.
   *  @param date Until which date to ask.
   */
  async deleteUntilLastAskingDate(date: Date): Promise<boolean> {
    return fileActions.deleteUntilLastAskingDate(date);
  }

  /**
   * Sets the errored to not started.
   */
  async resetErrored(): Promise<boolean> {
    return fileActions.resetErrored();
  }
}

export default new Files();

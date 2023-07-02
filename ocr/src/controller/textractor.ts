/**
 *  @packageDocumentation
 *  @module Controller/Textractor
 *  Controller to manage files and extractor.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

import CONFIG from '~/config';
import CONSTANTS from '~/constants';
import files from './files';
import ocr from './ocr';
import { logger, LABELS } from '~/utils/logger';

import { FileType } from '~/types/File';

/**
 *  Extracts and controls files.
 */
class Textractor {
  /**
   * If the extractor is already processing a file.
   */
  private _isProcessing = false;

  /**
   * Global timeout to process.
   */
  private _processTimeout: NodeJS.Timeout | false = false;

  /**
   * Constructs the extractor.
   */
  constructor() {
    const filesPath = this._getFilesPath();
    logger.info(`Saving files in ${filesPath}`, LABELS.INFO.TEXTRACTOR, {});
    if (!fs.existsSync(filesPath)) {
      fs.mkdirSync(filesPath, { recursive: true });
    }
  }

  /**
   * Processes the following file.
   */
  async processNextFile(): Promise<boolean> {
    if (this._isProcessing) {
      return true;
    }
    this._isProcessing = true;
    if (this._processTimeout !== false) {
      clearTimeout(this._processTimeout);
    }

    try {
      await this._processNextFile();
    } catch (error) {
      logger.error(error.message, CONSTANTS.LOGS.LABELS.ERROR.TEXTRACTOR, { error });
    }

    this._isProcessing = false;
    this._processTimeout = setTimeout(() => this.processNextFile(), this._getCheckingInterval());
    return true;
  }

  /**
   * Extracts the text from base 64.
   * @param base64 Base 64 of the file.
   */
  async extractFromBase64(base64: string): Promise<FileType> {
    const hash = crypto.createHash('sha256').update(base64).digest('hex');

    try {
      const existingFile = await files.getFromHash(hash);
      if (existingFile !== false) {
        return existingFile;
      }

      this._saveBase64AsFile(hash, base64);
      const addedFile = await files.add(hash);
      this.processNextFile();
      return addedFile;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * PRIVATE
   *
   */

  /**
   * Processes the following file.
   */
  private async _processNextFile(): Promise<boolean> {
    try {
      const nextFile = await files.getFirstNotStartedFile();
      if (!nextFile) {
        return true;
      }

      const { hash } = nextFile;
      const filePath = this._getFilePath(hash);
      await this._extractText(hash, filePath);
    } catch (error) {
      throw error;
    }
    return true;
  }

  /**
   * Executes the OCR for a filepath.
   * @param hash Hash of the file.
   * @param filePath Path to the OCR.
   */
  private async _extractText(hash: string, filePath: string): Promise<boolean> {
    let text = '';
    let isErrored = false;
    let errorDescription = '';

    try {
      await files.setStarted(hash);
      text = await ocr.execute(filePath, hash);
    } catch (error) {
      isErrored = true;
      logger.error(error.message, LABELS.ERROR.TEXTRACTOR, { error });
      errorDescription = error.code || error.message;
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    try {
      if (!isErrored) {
        await files.setFinished(hash, text);
      } else {
        await files.setErrored(hash, errorDescription);
      }
    } catch (error) {
      throw error;
    }

    return true;
  }

  /**
   * Save base64 as a file in the directory.
   * @param hash Hash of the base 64.
   * @param base64 Base 64 to convert to a file.
   */
  private _saveBase64AsFile(hash: string, base64: string): boolean {
    const filePath = this._getFilePath(hash);
    fs.writeFileSync(filePath, base64, { encoding: 'base64' });
    return true;
  }

  /**
   * Gets the file path for the hash.
   * @param hash Hash of the file.
   */
  private _getFilePath(hash: string): string {
    const filesPath = this._getFilesPath();
    return path.join(filesPath, hash);
  }

  /**
   * Gets the files path.
   */
  private _getFilesPath(): string {
    const filesPath = CONFIG.TEXTRACTOR_FILES_LOCATION;
    return path.join(filesPath, '');
  }

  /**
   * Gets the checking interval.
   */
  private _getCheckingInterval(): number {
    const interval = Number.parseInt(CONFIG.CHECK_NOT_STARTED_INTERVAL, 10);

    if (typeof interval !== 'number' || Number.isNaN(interval)) {
      throw new Error('Checking not started OCR interval must be a number!');
    }

    const MIN_VALUE = CONSTANTS.TEXTRACTOR.CHECKING_NOT_STARTED_INTERVAL_MIN;
    if (interval < MIN_VALUE) {
      throw new Error(`Checking not started OCR interval must be higher than ${MIN_VALUE}.`);
    }

    return interval;
  }
}

export default new Textractor();

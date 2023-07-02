/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @packageDocumentation
 * @module Controller/Extractor
 * Extracts the specified file text.
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';

import CodedError from '~/errors';
import fileOpener from './fileOpener';

/**
 * Extract texts from files or URLS.
 */
class Extractor {
  /**
   * Constructs the object.
   */
  constructor() {
    const tempPath = this.getTempPath();
    if (!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath);
    }
  }

  /**
   * Extracts the content from a URL.
   * @param fileName Name of the file sent.
   * @param url URL of the file.
   */
  async extractFromURL(url: string): Promise<string> {
    let result;
    let destination = '';
    if (!url.toLowerCase().startsWith('http')) {
      throw new CodedError('EXTRACTOR_INVALID_URL');
    }
    try {
      destination = this._generateRandomDestination();
      await this._downloadFile(url, destination);
      result = await fileOpener.extract(destination);
    } catch (error) {
      this._deleteFile(destination);
      throw error;
    }
    this._deleteFile(destination);
    return result;
  }

  /**
   * Extracts the content of a base64 file.
   * @param contentBase64 Base 64 of the file.
   */
  async extractFromBase64(contentBase64: string): Promise<string> {
    let result;
    let destination = '';
    try {
      destination = this._generateRandomDestination();
      fs.writeFileSync(destination, contentBase64, { encoding: 'base64' });
      result = await fileOpener.extract(destination);
    } catch (error) {
      this._deleteFile(destination);
      throw error;
    }
    this._deleteFile(destination);
    return result;
  }

  /**
   * Gets the path where the extractor temporarily save files.
   */
  getTempPath(): string {
    return path.join(__dirname, 'temp');
  }

  /**
   *
   * PRIVATE METHODS
   *
   */

  /**
   * Downloads a file from the specifeid URL to the specified destination.
   * @param url URL where you will find the file.
   * @param destination Filepath destination where you will save the file.
   */
  private async _downloadFile(url: string, destination: string): Promise<boolean> {
    return axios({
      url,
      method: 'get',
      responseType: 'stream',
    }).then((response) => {
      return new Promise((resolve, reject) => {
        if (response.status !== 200) {
          reject(new CodedError('EXTRACTOR_URL_CODE_NOT_200', [response.status]));
          return;
        }
        const writer = fs.createWriteStream(destination);
        response.data.pipe(writer);
        let error: Error;

        writer.on('error', (err) => {
          error = err;
          writer.close();
          writer.destroy();
          fs.unlinkSync(destination);
          reject(err);
        });

        writer.on('close', () => {
          if (!error) {
            resolve(true);
          }
        });
      });
    });
  }

  /**
   * Gets a random filename.
   */
  private _generateRandomDestination(): string {
    const random = Math.random() * 10000000;
    const randomRounded = Math.round(random);
    const now = new Date().getTime();
    const fileName = `${now}_${randomRounded}`;
    const tempPath = this.getTempPath();
    return path.join(tempPath, fileName);
  }

  /**
   * Delete file.
   * @param filePath File to delete
   */
  private _deleteFile(filePath: string): boolean {
    if (!fs.existsSync(filePath)) {
      return true;
    }
    fs.unlinkSync(filePath);
    return true;
  }
}

export default new Extractor();

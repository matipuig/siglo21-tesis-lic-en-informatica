import axios from 'axios';
import crypto from 'crypto';

import CONFIG from '~/config';
import OCRProccess from './OCRProccess';
import files from './files';
import tesseract from './tesseract';

import { DBOCRProcessType, OCRProcessType } from '~/types/OCRProcess';

class OCR {
  private _processTimeout: NodeJS.Timeout | undefined;

  startExtractions() {
    if (this._processTimeout) {
      clearTimeout(this._processTimeout);
    }
    this._processTimeout = setTimeout(() => this._processNextFile(), 2000);
  }

  async extract(base64: string, metadata: string): Promise<OCRProcessType> {
    try {
      await files.add(base64);
      const hash = crypto.createHash('sha256').update(base64).digest('hex');
      return OCRProccess.add(hash, metadata);
    } catch (error) {
      throw error;
    }
  }

  async getByHash(hash: string): Promise<OCRProcessType | false> {
    return OCRProccess.getState(hash);
  }

  private async _processNextFile(): Promise<void> {
    try {
      if (this._processTimeout) {
        clearTimeout(this._processTimeout);
      }
      const nextFile = await OCRProccess.getFirstNotStartedFile();
      if (!nextFile) {
        this.startExtractions();
        return;
      }
      const { hash } = nextFile;
      const filePath = files.getFilePathByHash(hash);
      await this._extract(hash, filePath);
    } catch (error) {
      console.error(error);
    }
    this.startExtractions();
  }

  private async _extract(hash: string, filePath: string): Promise<void> {
    try {
      console.log(`Extrayendo contenido de archivo ${hash}`);
      await OCRProccess.setStarted(hash);
      const textResult = await tesseract.execute(filePath);
      await OCRProccess.setFinished(hash, textResult);
      const { metadata, text } = (await OCRProccess.getState(hash)) as DBOCRProcessType;
      await axios.post(CONFIG.SERVICES.LOADER_URL, { metadata, textContent: text });
    } catch (error) {
      await OCRProccess.setErrored(hash, (error as Error).message);
      throw error;
    }
  }
}

export default new OCR();

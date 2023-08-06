import fs from 'fs';
import { isNull } from 'lodash';
import path from 'path';
import DocumentsDAO from '~/model/actions/DocumentsDAO';
import filesDAO from '~/model/actions/filesDAO';

import FileTextExtractionProcessDAO from '~/model/actions/FileTextExtractionProcessDAO';
import extractorService from '~/services/extractor';
import ocrService from '~/services/ocr';
import { DBFileType } from '~/types/File';

const FILES_PATH = path.join(__dirname, '..', '..', 'persisted');

class FilesProcessor {
  private _extractTextTimeout: NodeJS.Timeout | undefined;

  private _startNextOCRTimeout: NodeJS.Timeout | undefined;

  constructor() {
    if (!fs.existsSync(FILES_PATH)) {
      fs.mkdirSync(FILES_PATH, { recursive: true });
    }
  }

  start() {
    this._extractTextTimeout = setTimeout(() => this._extractNextText(), 2000);
    this._startNextOCRTimeout = setTimeout(() => this._startNextOCR(), 2000);
  }

  async setFileText(fileId: number, textContent: string): Promise<boolean> {
    try {
      const file = await filesDAO.getById(fileId);
      const { documentId } = file;
      await filesDAO.set({ ...file, textContent });
      await FileTextExtractionProcessDAO.setState(fileId, 'FINISHED');
      await DocumentsDAO.setState(documentId, 'TEXT_EXTRACTED');
      return true;
    } catch (error) {
      throw error;
    }
  }

  private async _extractNextText(): Promise<void> {
    let fileId = 0;
    let documentId = 0;
    try {
      if (this._extractTextTimeout) {
        clearTimeout(this._extractTextTimeout);
      }
      const nextToExtract = await FileTextExtractionProcessDAO.getFirstByState('NOT_STARTED');
      if (!nextToExtract) {
        this._extractTextTimeout = setTimeout(() => this._extractNextText(), 2000);
        return;
      }
      fileId = nextToExtract.fileId;
      const file = await filesDAO.getById(fileId);
      documentId = file.documentId;
      const base64 = this._getBase64(file);
      const textContent = await extractorService.extract(base64);
      if (textContent === '') {
        await FileTextExtractionProcessDAO.setState(fileId, 'WAITING_OCR');
      } else {
        await this.setFileText(fileId, textContent);
      }
    } catch (error) {
      if (fileId !== 0) {
        await FileTextExtractionProcessDAO.setState(fileId, 'ERRORED', (error as Error).message);
      }
      if (documentId !== 0) {
        await DocumentsDAO.setState(documentId, 'ERRORED');
      }
      console.error(error);
    } finally {
      this._extractTextTimeout = setTimeout(() => this._extractNextText(), 2000);
    }
  }

  private async _startNextOCR(): Promise<void> {
    let fileId = 0;
    let documentId = 0;
    try {
      if (this._startNextOCRTimeout) {
        clearTimeout(this._startNextOCRTimeout);
      }
      const nextToExtract = await FileTextExtractionProcessDAO.getFirstByState('WAITING_OCR');
      if (!nextToExtract) {
        this._startNextOCRTimeout = setTimeout(() => this._startNextOCR(), 2000);
        return;
      }
      fileId = nextToExtract.fileId;
      const file = await filesDAO.getById(fileId);
      documentId = file.documentId;
      const base64 = this._getBase64(file);
      const metadata = JSON.stringify({ fileId });
      const textContent = await ocrService.extract(base64, metadata);
      if (isNull(textContent)) {
        await FileTextExtractionProcessDAO.setState(fileId, 'EXECUTING_OCR');
      } else {
        await this.setFileText(fileId, textContent);
      }
    } catch (error) {
      if (fileId !== 0) {
        await FileTextExtractionProcessDAO.setState(fileId, 'ERRORED', (error as Error).message);
      }
      if (documentId !== 0) {
        await DocumentsDAO.setState(documentId, 'ERRORED');
      }
      console.error(error);
    } finally {
      this._startNextOCRTimeout = setTimeout(() => this._startNextOCR(), 2000);
    }
  }

  private _getBase64(file: DBFileType): string {
    const { fileHash } = file;
    const filePath = path.join(FILES_PATH, fileHash);
    return fs.readFileSync(filePath, 'base64');
  }
}

export default new FilesProcessor();

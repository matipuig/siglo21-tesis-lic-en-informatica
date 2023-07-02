/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @packageDocumentation
 * @module Controller/OCR
 * Executes the OCR.
 */
import fs from 'fs';
import fileType from 'file-type';
import tesseract from 'node-tesseract-ocr';

import CodedError, { CODES } from '~/errors';
import files from './files';

type OCRResultType = {
  // eslint-disable-next-line camelcase
  text_pages: string[];
};

type OCRPageCompletedType = {
  index: number;
  // eslint-disable-next-line camelcase
  num_pages: number;
};

const PDFExtractor = require('pdf-extract');

/**
 * Executes the OCR
 */
class OCR {
  /**
   * Execute the OCR and returns the string.
   * @param filePath Path to the file.
   * @param fileHash File hash.
   */
  async execute(filePath: string, fileHash: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
      throw new Error("File doesn't exists!");
    }

    // TODO: DO MAIN VALIDATIONS (pages of the PDF, size, etc...)

    try {
      const extType = await fileType.fromFile(filePath);
      const mimeType = extType?.ext || '';

      switch (mimeType) {
        case 'pdf':
          return this._fromPDF(filePath, fileHash);

        case 'apng':
        case 'bmp':
        case 'gif':
        case 'icns':
        case 'ico':
        case 'jpg':
        case 'jpx':
        case 'png':
        case 'tif':
        case 'ttf':
        case 'webp':
          return this._fromImage(filePath);

        default:
          throw new CodedError('OCR_MIME_TYPE_ERROR', [], { mimeType });
      }
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
   * Executes the OCR and returns the string.
   * @param filePath Path to the file.
   */
  private async _fromImage(filePath: string): Promise<string> {
    try {
      const config = {
        lang: 'eng+spa',
        oem: 1,
        psm: 3,
      };
      const image = fs.readFileSync(filePath);
      const result = await tesseract.recognize(image, config);
      return result;
    } catch (error) {
      throw new CodedError(CODES.OCR_IMAGE_ERROR, [], { error });
    }
  }

  /**
   * Executes the OCR and returns the string.
   * @param filePath Path to the file.
   * @param fileHash Hash of the file.
   */
  private async _fromPDF(filePath: string, fileHash: string): Promise<string> {
    const options = {
      type: 'ocr',
      clean: true,
      ocr_flags: ['--psm 1', '-l spa+eng', 'alphanumeric'],
    };

    return new Promise((resolve, reject) => {
      const pdfProcessor = PDFExtractor(filePath, options, (error: Error) => {
        if (error) {
          reject(new CodedError('OCR_PDF_ERROR', [], { error }));
        }
      });

      pdfProcessor.on('complete', (data: OCRResultType) => resolve(this._parsePDFResult(data)));

      pdfProcessor.on('page', (data: OCRPageCompletedType) => {
        const percentage = (data.index / data.num_pages) * 100;
        return files.setPercentageCompleted(fileHash, percentage);
      });

      pdfProcessor.on('error', (error: Error) => {
        reject(new CodedError('OCR_PDF_ERROR', [], { error }));
      });
    });
  }

  /**
   * Parses the OCR result type and returns its text.
   * @param result Result from the OCR.
   */
  private _parsePDFResult(result: OCRResultType): string {
    const text = result.text_pages.join(' ');
    return text.replace(/\s+/gm, ' ');
  }
}

export default new OCR();

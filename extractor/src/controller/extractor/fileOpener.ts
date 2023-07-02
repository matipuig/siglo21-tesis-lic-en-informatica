/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @packageDocumentation
 * @module Controller/Extractor/FileOpener
 * Extracts the text from the file.
 */

import FileType from 'file-type';
import fs from 'fs';
import MsgReader from '@kenjiuno/msgreader';
import { convert } from 'html-to-text';

import CodedError, { CODES } from '~/errors';

// Imported like this because they don't support typescript.
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const officeParser = require('officeparser');
const rtfToHTML = require('@iarna/rtf-to-html');
const WordExtractor = require('word-extractor');

/**
 * Extract texts from files or URLS.
 */
class FileOpener {
  /**
   * Extracts the file content.
   * @param filePath Fiel location.
   */
  async extract(filePath: string): Promise<string> {
    try {
      if (!fs.existsSync(filePath)) {
        throw new CodedError('EXTRACTOR_FILE_ERROR');
      }
      const fileType = await FileType.fromFile(filePath);
      const extension = fileType?.ext || '';

      switch (extension) {
        case 'pdf':
          return this._getPDFContent(filePath);

        case 'docx':
          return this._getDocxContent(filePath);

        case 'cfb':
          return this._getCFBContent(filePath);

        case 'odp':
        case 'ods':
        case 'odt':
        case 'pptx':
        case 'xlsx':
          return this._getOfficeParserFileContent(filePath, extension);

        case 'bmp':
        case 'gif':
        case 'jpg':
        case 'png':
        case 'tif':
          return '';

        case 'rtf':
          return this._getRTFContent(filePath);

        case '':
        case undefined:
          return fs.readFileSync(filePath, { encoding: 'utf8' });

        default:
          throw new CodedError(CODES.EXTRACTOR_INVALID_TYPE, [extension], { fileType });
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
   * Gets the PDF content.
   * @param filePath Path to the file.
   */
  private async _getPDFContent(filePath: string): Promise<string> {
    try {
      const buffer = fs.readFileSync(filePath);
      let finalText = await pdfParse(buffer, { version: 'v2.0.550' });
      // This is the only way I could convert it to UTF8!
      finalText = JSON.parse(JSON.stringify(finalText.text));
      finalText = finalText.replace(/(\r\n|\r|\n|\s)/gim, ' ');
      // This line is to prevent "       " when PDFs are without OCR.
      if (finalText.trim() === '') {
        return '';
      }
      return finalText;
    } catch (error) {
      throw new CodedError('EXTRACTOR_PDF_ERROR');
    }
  }

  /**
   * Gets the docx content.
   * @param filePath Path to the docx file.
   */
  private async _getDocxContent(filePath: string): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      throw new CodedError('EXTRACTOR_DOCX_ERROR');
    }
  }

  /**
   * Gets the content from an office file with office parser.
   * @param filePath File path to get.
   * @param extension Extension of the file.
   */
  private async _getOfficeParserFileContent(filePath: string, extension: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Sadly, this thing only works if the file has the extension.
      const filePathWithExtension = `${filePath}.${extension}`;
      fs.renameSync(filePath, filePathWithExtension);
      officeParser.parseOffice(filePathWithExtension, (data: string, error: Error) => {
        if (fs.existsSync(filePathWithExtension)) {
          fs.unlinkSync(filePathWithExtension);
        }
        if (error) {
          const codedError = new CodedError(CODES.EXTRACTOR_OFFICE_PARSER_ERROR, [], { error });
          reject(codedError);
          return;
        }
        resolve(data);
      });
    });
  }

  /**
   * Gets the content from an rtf text.
   * @param filePath File path to get.
   */
  private async _getRTFContent(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      rtfToHTML.fromStream(fs.createReadStream(filePath), (error: Error, html: string): void => {
        if (error) {
          const codedError = new CodedError(CODES.EXTRACTOR_RTF_ERROR, [], { error });
          reject(codedError);
          return;
        }
        const text = this._htmlToText(html);
        const removedFilesText = text.replace(/[0-9a-f]{100,}/gim, '');
        resolve(removedFilesText);
      });
    });
  }

  /**
   * Gets the content as compound file binary format.
   * @param filePath File path to get.
   */
  private async _getCFBContent(filePath: string): Promise<string> {
    try {
      const docContent = await this._getDocContent(filePath);
      if (this._cleanText(docContent) !== '') {
        return docContent;
      }
      return this._getMsgContent(filePath);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gets the doc content.
   * @param filePath Path to the doc file.
   */
  private async _getDocContent(filePath: string): Promise<string> {
    try {
      const extractor = new WordExtractor();
      const extracted = await extractor.extract(filePath);
      const headers = extracted.getHeaders({ includeFooters: false });
      const body = extracted.getBody();
      const footers = extracted.getFooters();
      const footNotes = extracted.getFootnotes();
      return `${headers}\n${body}\n${footers}\n${footNotes}`;
    } catch (error) {
      const errorThrown = error as CodedError;
      if (errorThrown.code === 'ERR_BUFFER_OUT_OF_BOUNDS') {
        return '';
      }
      throw new CodedError(CODES.EXTRACTOR_DOC_ERROR);
    }
  }

  /**
   * Gets the msg contnet.
   * @param filePath Path of the file.
   */
  private _getMsgContent(filePath: string): string {
    try {
      const msgFileBuffer = fs.readFileSync(filePath);
      const msgContent = new MsgReader(msgFileBuffer);
      const msgData = msgContent.getFileData();
      const { body, bodyHtml } = msgData;
      const finalBody = body ? this._htmlToText(body) : '';
      const finalBodyHtml = bodyHtml ? this._htmlToText(bodyHtml) : '';
      return `${finalBody}\n${finalBodyHtml}`;
    } catch (error) {
      throw new CodedError(CODES.EXTRACTOR_MSG_ERROR);
    }
  }

  /**
   * Converts HTML to text.
   * @param html HTML to convert.
   */
  private _htmlToText(html: string): string {
    return convert(html, {
      preserveNewlines: true,
      wordwrap: 125,
    });
  }

  /**
   * Cleans the text.
   * @param text Text to clean.
   */
  private _cleanText(text: string): string {
    return text.replace(/s+/gim, ' ');
  }
}

export default new FileOpener();

/* eslint-disable @typescript-eslint/no-var-requires */
import crypto from 'crypto';
import fs from 'fs';
import FileType from 'file-type';
import path from 'path';

const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');

class Extractor {
  private _tempPath = path.join(__dirname, 'temp');

  constructor() {
    if (!fs.existsSync(this._tempPath)) {
      fs.mkdirSync(this._tempPath);
    }
  }

  async extractFromBase64(base64: string): Promise<string> {
    let filePath = '';
    let contentText = '';
    try {
      const hash = crypto.createHash('sha256').update(base64).digest('hex');
      const filePath = path.join(this._tempPath, hash);
      fs.writeFileSync(filePath, base64, { encoding: 'base64' });
      const fileType = await FileType.fromFile(filePath);
      const extension = fileType?.ext || '';
      switch (extension) {
        case 'pdf':
          contentText = await this._extractFromPDF(filePath);
          break;
        case 'docx':
          contentText = await this._extractFromDocx(filePath);
          break;
        default:
          throw new Error(`No se reconoce el formato "${extension}"`);
      }
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      contentText = contentText.replace(/(\r\n|\r|\n|\s)/gim, ' ').trim();
      return contentText;
    } catch (error) {
      if (filePath !== '' && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }
  }

  private async _extractFromPDF(filePath: string): Promise<string> {
    try {
      const buffer = fs.readFileSync(filePath);
      let finalText = await pdfParse(buffer, { version: 'v2.0.550' });
      // Para convertir a utf8.
      finalText = JSON.parse(JSON.stringify(finalText.text));
      return finalText;
    } catch (error) {
      throw error;
    }
  }

  private async _extractFromDocx(filePath: string): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      throw error;
    }
  }
}

export default new Extractor();

import fs from 'fs';
import fileType from 'file-type';

const PDFExtractor = require('pdf-extract');

type OCRResultType = {
  text_pages: string[];
};

type OCRPageCompletedType = {
  index: number;
  num_pages: number;
};

class Tesseract {
  async execute(filePath: string): Promise<string> {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File ${filePath} doesn't exists!`);
      }
      const extType = await fileType.fromFile(filePath);
      const mimeType = extType?.ext || '';
      if (mimeType !== 'pdf') {
        throw new Error(`EL formato de archivo debe ser PDF.`);
      }

      const parsePDFResult = (result: OCRResultType): string => {
        const text = result.text_pages.join(' ');
        return text.replace(/\s+/gm, ' ');
      };

      const options = {
        type: 'ocr',
        clean: true,
        ocr_flags: ['--psm 1', '-l spa+eng', 'alphanumeric'],
      };
      return new Promise((resolve, reject) => {
        const pdfProcessor = PDFExtractor(filePath, options, (error: Error) => {
          if (error) {
            reject(error);
          }
        });
        pdfProcessor.on('error', (error: Error) => {
          reject(error);
        });
        pdfProcessor.on('page', (data: OCRPageCompletedType) => {
          const percentage = ((data.index + 1) / data.num_pages) * 100;
          console.log(`Extraction percentage: ${filePath} ${percentage}%`);
        });
        pdfProcessor.on('complete', (data: OCRResultType) => resolve(parsePDFResult(data)));
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new Tesseract();

/**
 *  Contains the data needed for the tests.
 */
import path from 'path';

export const TEST_FILES = {
  DOCX: path.join(__dirname, 'files', 'test.docx'),
  PDF: path.join(__dirname, 'files', 'test.pdf'),
  TXT: path.join(__dirname, 'files', 'test.txt'),
};

export const TEST_URLS = {
  DOCX:
    'http://www.bibliopsi.org/docs/resumenes/resumenes%20obligatorias/resumenes%20psicometricas/resumenes%20mikulic/Resumen%20Psicometricas%20Final.docx',
  PDF: 'https://ialab.com.ar/wp-content/uploads/2019/09/AIW.pdf',
  TXT: 'https://www.google.com',
};

export const TEST_URLS_CONTENTS = {
  DOCX: 'introspecci',
  PDF: 'algortimo',
  TXT: 'googl',
};

export const FILE_CONTENT = 'Testing content';

export default { FILE_CONTENT, TEST_FILES, TEST_URLS };

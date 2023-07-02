/**
 *  Unit control.
 *  Add unit testings here.
 */
import fs from 'fs';

import extractor from '../../src/controller/extractor';
import { TEST_FILES, TEST_URLS, FILE_CONTENT, TEST_URLS_CONTENTS } from '../data';

jest.setTimeout(30000);

/**
 * Executes extraction in base 64 and returns the result.
 */
const testExtractionBase64 = async function testExtractionBase64(
  filePath: string,
): Promise<string> {
  const base64 = fs.readFileSync(filePath, { encoding: 'base64' });
  const content = await extractor.extractFromBase64(base64);
  return content.trim();
};

/**
 * Executes extraction with the URL.
 */
const testExtractionURL = async function testExtractionURL(url: string): Promise<string> {
  const content = await extractor.extractFromURL(url);
  return content.trim();
};

describe('Testing extraction with base 64...', () => {
  test('Can read docx', async () => {
    const content = await testExtractionBase64(TEST_FILES.DOCX);
    expect(content).toBe(FILE_CONTENT);
  });

  test('Can read pdf', async () => {
    const content = await testExtractionBase64(TEST_FILES.PDF);
    expect(content).toBe(FILE_CONTENT);
  });

  test('Can read txt', async () => {
    const content = await testExtractionBase64(TEST_FILES.TXT);
    expect(content).toBe(FILE_CONTENT);
  });
});

describe('Testing extraction by URL...', () => {
  test('Can get content from the web', async () => {
    const content = await testExtractionURL(TEST_URLS.TXT);
    const hasContent = content.includes(TEST_URLS_CONTENTS.TXT);
    expect(hasContent).toBe(true);
  });

  test('Can read pdf', async () => {
    const content = await testExtractionURL(TEST_URLS.PDF);
    const hasContent = content.toLowerCase().includes(TEST_URLS_CONTENTS.PDF);
    expect(hasContent).toBe(true);
  });

  test('Throws error if not found', async (done) => {
    const getContent = () =>
      testExtractionURL('https://www.google.com/something/that/do/not/exists');
    expect(getContent()).resolves.toThrow();
    expect(true).toBe(true);
    done();
  });
});

describe('Testing that all the temp files were removed', () => {
  test('Temp dir is empty', async () => {
    const tempDir = extractor.getTempPath();
    const content = fs.readdirSync(tempDir);
    expect(content.length).toBe(0);
  });
});

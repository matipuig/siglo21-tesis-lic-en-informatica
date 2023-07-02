/**
 *  Unit control.
 *  Add integration testings here.
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from 'supertest';
import fs from 'fs';

import app from '../../../src/app';
import CONSTANTS from '../../../src/constants';
import { getAuthHeader } from './api';

import { TEST_FILES, TEST_URLS, FILE_CONTENT, TEST_URLS_CONTENTS } from '../../data';

jest.setTimeout(60000);

const APITester = supertest(app);
const { ROUTES } = CONSTANTS;
const auth = getAuthHeader();

/**
 * Executes extraction in base 64 and returns the result.
 */
const getExtractionBase64 = async function getExtractionBase64(filePath: string): Promise<string> {
  const base64 = fs.readFileSync(filePath, { encoding: 'base64' });
  return new Promise((resolve, reject) => {
    APITester.post(ROUTES.API.EXTRACTOR.FROM_BASE64)
      .set(auth.key, auth.value)
      .set('Content-Type', 'application/json')
      .send({ base64 })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          reject(err);
        }
        const result = JSON.parse(res.text);
        if (result.success === false) {
          reject(new Error('Error in API.'));
        }
        resolve(result.payload.textContent.trim());
      });
  });
};

/**
 * Executes extraction by URL and returns the result.
 */
const getFromURL = async function getFromURL(url: string): Promise<string> {
  const API_URL = `${ROUTES.API.EXTRACTOR.FROM_URL}?url=${url}`;
  return new Promise((resolve, reject) => {
    APITester.get(API_URL)
      .set(auth.key, auth.value)
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          reject(err);
        }
        const result = JSON.parse(res.text);
        if (result.success === false) {
          reject(new Error('Error in API.'));
        }
        resolve(result.payload.textContent.trim());
      });
  });
};

describe('Testing extraction with base 64...', () => {
  test('Can read docx', async () => {
    const content = await getExtractionBase64(TEST_FILES.DOCX);
    expect(content).toBe(FILE_CONTENT);
  });

  test('Can read pdf', async () => {
    const content = await getExtractionBase64(TEST_FILES.PDF);
    expect(content).toBe(FILE_CONTENT);
  });

  test('Can read txt', async () => {
    const content = await getExtractionBase64(TEST_FILES.TXT);
    expect(content).toBe(FILE_CONTENT);
  });
});

describe('Testing extraction by URL...', () => {
  test('Can read web content', async () => {
    const content = await getFromURL(TEST_URLS.TXT);
    const hasContent = content.includes(TEST_URLS_CONTENTS.TXT);
    expect(hasContent).toBe(true);
  });

  test('Can read pdf', async () => {
    const content = await getFromURL(TEST_URLS.PDF);
    const hasContent = content.toLowerCase().includes(TEST_URLS_CONTENTS.PDF);
    expect(hasContent).toBe(true);
  });
});

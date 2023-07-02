/* eslint-disable no-await-in-loop */
/**
 *  Tests API general functions.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from 'supertest';

import app from '../../../src/app';
import CONSTANTS from '../../../src/constants';
import { getAuthHeader } from './api';

jest.setTimeout(30000);

const APITester = supertest(app);
const { ROUTES } = CONSTANTS;
const auth = getAuthHeader();

describe('API general functionalities', () => {
  test('System returns not authorized to requests with no auth.', async (done) => {
    APITester.get(ROUTES.API.TESTING)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.success).toBe(false);
        done();
      });
  });

  test('System rejects wrong format auth.', async (done) => {
    APITester.get(ROUTES.API.TESTING)
      .set('Accept', 'application/json')
      .set(auth.key, `${auth.value} BUT WRONG!!!`)
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.success).toBe(false);
        done();
      });
  });

  test('System rejects wrong  auth.', async (done) => {
    APITester.get(ROUTES.API.TESTING)
      .set('Accept', 'application/json')
      .set(auth.key, `${auth.value}idsfsdiojfsodisjdf`)
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.success).toBe(false);
        done();
      });
  });

  test('System rejects empty auth.', async (done) => {
    APITester.get(ROUTES.API.TESTING)
      .set('Accept', 'application/json')
      .set(auth.key, '')
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.success).toBe(false);
        done();
      });
  });

  test('System accepts good auth.', async (done) => {
    APITester.get(ROUTES.API.TESTING)
      .set('Accept', 'application/json')
      .set(auth.key, auth.value)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.success).toBe(true);
        done();
      });
  });

  test('System returns not found to authorized requests.', async (done) => {
    APITester.get('/randomUrl')
      .set(auth.key, auth.value)
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.success).toBe(false);
        done();
      });
  });
});

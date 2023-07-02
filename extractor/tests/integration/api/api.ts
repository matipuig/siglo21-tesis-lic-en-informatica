/* eslint-disable no-await-in-loop */
/**
 *  Authorization function to get the token.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import JWT from 'jsonwebtoken';

import CONFIG from '../../../src/config';

type HeaderType = {
  key: string;
  value: string;
};

// Disable to use SuperTest without SSL.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/**
 * Signs the user with JWT to use.
 */
const getJWTToken = function getJWTToken(): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const algorithm: any = CONFIG.AUTH.JWT_ALGORITHM;
  return JWT.sign({}, CONFIG.AUTH.JWT_SECRET, { algorithm });
};

/**
 * Gets the data for the header.
 */
export const getAuthHeader = function getAuthHeader(): HeaderType {
  if (CONFIG.AUTH.USE_JWT) {
    const token = getJWTToken();
    return {
      key: 'Authorization',
      value: `Bearer ${token}`,
    };
  }
  return {
    key: 'X-API-KEY',
    value: CONFIG.AUTH.API_KEY,
  };
};

export default {
  getAuthHeader,
};

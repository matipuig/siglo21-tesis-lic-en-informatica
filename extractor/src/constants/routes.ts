/**
 *  @packageDocumentation
 *  @hidden
 *  Contains the router constants.
 *  NOTE: Control interval are quite high (the let too many requests) because it's a microservice. It might receive a lot of requests per sec frmo the same IPs.
 */

export default {
  /**
   *  Documentation location.
   */
  DOCS: '/docs',

  /**
   *  API routes.
   */
  API: {
    /**
     *  Testing URL.
     */
    TESTING: '/testing',

    /**
     *   Extractor routes.
     */
    EXTRACTOR: {
      /**
       * From URL.
       */
      FROM_URL: '/extract/url',

      /**
       *  From base64.
       */
      FROM_BASE64: '/extract/base64',
    },
  },
};

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
     * OCR files routes.
     */
    OCR_FILES: {
      /**
       * Get global state.
       */
      GET_FROM_HASH: '/extractor/hash/:hash',

      /**
       * Get many states from hashes.
       */
      GET_STATES_FROM_HASHES: '/extractor/files/state',

      /**
       * Get errored files.
       */
      GET_ERRORED: '/extractor/get-errored',

      /**
       * Get global state.
       */
      GET_GLOBAL_STATE: '/extractor/state',

      /**
       * Delete by hashes.
       */
      DELETE_BY_HASH: '/extractor/hash',

      /**
       * Resets the errored.
       */
      RESET_ERRORED: '/extractor/reset-errored',
    },

    /**
     * Textractor routes.
     */
    TEXTRACTOR: {
      /**
       * Extractor from base 64.
       */
      FROM_BASE_64: '/extract/base64',
    },

    /**
     *  Testing URL.
     */
    TESTING: '/testing',
  },
};

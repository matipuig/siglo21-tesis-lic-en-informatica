/**
 *  @packageDocumentation
 *  @hidden
 *  Contains log labels.
 */
import path from 'path';

const logsFile = path.join('~', '..', 'persisted', 'logs.log');

export default {
  /**
   *  Log file path.
   */
  LOGS_FILE: logsFile,

  /**
   *  Contains labels for logs.
   */
  LABELS: {
    /**
     *  Used console... method.
     */
    CONSOLE: 'CONSOLE_METHOD',

    /**
     *  Error labels.
     */
    ERROR: {
      /**
       *  Error starting the server.
       */
      STARTING: 'ERROR_STARTING',

      /**
       *  Error exiting the server.
       */
      EXITING: 'ERROR_EXITING',

      /**
       *  Process.on() error.
       */
      PROCESS_ON: 'ERROR_PROCESS_ON',

      /**
       *  A
       */
      API_REQUEST: 'ERROR_API_REQUEST',

      /**
       *  Error in textractor.
       */
      TEXTRACTOR: 'ERROR_TEXTRACTOR',
    },

    /**
     *  Info labels.
     */
    INFO: {
      /**
       *  Normal app proccesses.
       */
      APP_PROCESS: 'APP_PROCESS',

      /**
       *  Textractor proccesses.
       */
      TEXTRACTOR: 'TEXTRACTOR',
    },
  },
};

const getFromEnvOrError = function getFromEnvOrError(
  variable: string,
  defaultValue: string | undefined = undefined,
  preserveOriginal = false,
): string {
  const value = process.env[variable];
  if (typeof value !== 'undefined') {
    if (!preserveOriginal) {
      delete process.env[variable];
    }
    return value;
  }
  if (typeof defaultValue !== 'undefined') {
    return defaultValue;
  }
  throw new Error(`Environment variable "${variable}" is not defined.`);
};

const CONFIG = {
  SOURCE_NAME: getFromEnvOrError('SOURCE_NAME'),
  FILES_DIR_PATH: getFromEnvOrError('FILES_DIR_PATH'),
  SERVICES: {
    LOADER_URL: getFromEnvOrError('SERVICE_LOADER_URL'),
  },
};

export default CONFIG;

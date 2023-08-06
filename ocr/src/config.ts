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
  DB: {
    SQL: {
      HOST: getFromEnvOrError('SQL_HOST'),
      DATABASE: getFromEnvOrError('SQL_DATABASE'),
      USER: getFromEnvOrError('SQL_USERNAME'),
      PASSWORD: getFromEnvOrError('SQL_PASSWORD'),
    },
  },

  SERVICES: {
    LOADER_URL: getFromEnvOrError('LOADER_URL'),
  },
};

export default CONFIG;

import { isObject } from 'lodash';

const handleValidationError = function handleValidationError(error: any): never {
  if (Array.isArray(error.errors)) {
    const firstError = error.errors[0];
    throw new Error(firstError.message);
  }
  if (isObject(error.errors)) {
    const firstError = Object.keys(error.errors).shift();
    if (!firstError) {
      console.error(error);
      throw new Error('Error no definido...');
    }
    const message = error.errors[firstError].message || 'Message in model not assigned!';
    console.error(error);
    throw new Error(message);
  }
  throw new Error('Error no definido...');
};

const handleError = function handleError(error: any): never {
  const err = error as Error;
  if (err.name) {
    throw error;
  }
  return handleValidationError(error);
};

export default handleError;

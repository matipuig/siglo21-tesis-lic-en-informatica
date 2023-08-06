const envError = (varName: string): never => {
  throw new Error(`Environment variable ${varName} is not defined.`);
};

const CONFIG = {
  NEXT_BASE_URL: process.env.NEXT_BASE_URL || '',
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || envError('NEXT_PUBLIC_BACKEND_URL'),
};

export default CONFIG;

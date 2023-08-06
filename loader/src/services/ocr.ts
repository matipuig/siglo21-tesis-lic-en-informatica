import axios from 'axios';

import CONFIG from '~/config';

const axiosClient = axios.create({
  baseURL: CONFIG.SERVICES.OCR_URL,
  timeout: 20000,
});

class OCRService {
  async extract(base64: string, metadata: string): Promise<string | null> {
    try {
      const result = await axiosClient.post('/extract', { base64, metadata });
      const response = result.data.payload.textContent;
      if (response.state === 'ERRORED') {
        throw new Error(`OCR errored: ${response.error}`);
      }
      if (response.state !== 'FINISHED') {
        return null;
      }
      return response.text;
    } catch (error) {
      throw error;
    }
  }
}

export default new OCRService();

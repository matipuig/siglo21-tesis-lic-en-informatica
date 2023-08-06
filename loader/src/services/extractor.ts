import axios from 'axios';

import CONFIG from '~/config';

const axiosClient = axios.create({
  baseURL: CONFIG.SERVICES.EXTRACTOR_URL,
  timeout: 20000,
});

class ExtractorService {
  async extract(base64: string): Promise<string> {
    try {
      const result = await axiosClient.post('/extract', { base64 });
      return result.data.payload.textContent;
    } catch (error) {
      throw error;
    }
  }
}

export default new ExtractorService();

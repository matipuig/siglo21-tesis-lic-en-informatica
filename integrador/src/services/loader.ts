import axios from 'axios';
import { cloneDeep } from 'lodash';

import CONFIG from '~/config';
import { ContentHashResult, NewDocumentType } from '~/types/Integrator';

const { SERVICES, SOURCE_NAME } = CONFIG;
const { LOADER_URL } = SERVICES;

const axiosClient = axios.create({
  baseURL: LOADER_URL,
  timeout: 20000,
});

class LoaderService {
  async getContentHashes(sourceDocumentIdentifiers: string[]): Promise<ContentHashResult[]> {
    try {
      const body = { source: SOURCE_NAME, sourceDocumentIdentifiers };
      const result = await axiosClient.post('/hashes', body);
      return result.data.payload as ContentHashResult[];
    } catch (error) {
      throw error;
    }
  }

  async set(document: NewDocumentType): Promise<unknown> {
    try {
      const documentData = cloneDeep(document);
      documentData.metadata = JSON.stringify(document.metadata);
      const result = await axiosClient.post('/', documentData);
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(sourceDocumentIdentifier: string): Promise<boolean> {
    try {
      const result = await axiosClient.delete(`${SOURCE_NAME}/${sourceDocumentIdentifier}`);
      return result.data.payload;
    } catch (error) {
      throw error;
    }
  }
}

export default new LoaderService();

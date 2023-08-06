import axios from 'axios';
import { noop } from 'lodash';

import CONFIG from '~/config';
import { ColumnsType, ResultType, SearchParamsType } from '~/types/Search';

const APIClient = axios.create({
  baseURL: CONFIG.BACKEND_URL,
  timeout: 10000,
});

export type FindResultsType = {
  results: ResultType[];
  itemsPerPage: number;
  page: number;
};

type SearchResultType =
  | {
      find: FindResultsType;
      count: number;
    }
  | FindResultsType;

class BackendAPI {
  async getDistinctColumns(): Promise<ColumnsType> {
    const url = `/columns`;
    try {
      const response = await APIClient.get(url);
      return response.data.payload;
    } catch (error) {
      throw error;
    }
  }

  async search(search: SearchParamsType, withCount = false): Promise<SearchResultType> {
    const url = withCount ? `/find-with-count` : '/find';
    try {
      const response = await APIClient.post(url, search);
      return response.data.payload;
    } catch (error) {
      throw error;
    }
  }

  getDownloadURL(id: number, fileName: string): string {
    noop(fileName);
    return `${CONFIG.BACKEND_URL}/file/${id}`;
  }
}

export default new BackendAPI();

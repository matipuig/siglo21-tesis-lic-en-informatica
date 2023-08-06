import axios from 'axios';

type AddToSearcherType = {
  sourceId: string;
  fileName: string;
  textContent: string;
  metadata: unknown;
  base64: string;
};

class SearcherService {
  async set(searcherUrl: string, document: AddToSearcherType): Promise<unknown> {
    try {
      const url = searcherUrl.endsWith('/') ? searcherUrl : `${searcherUrl}/`;
      const result = await axios.post(url, document);
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(searcherUrl: string, sourceId: string): Promise<unknown> {
    try {
      const url = searcherUrl.endsWith('/') ? searcherUrl : `${searcherUrl}/`;
      const result = await axios.delete(`${url}${sourceId}`);
      return result.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new SearcherService();

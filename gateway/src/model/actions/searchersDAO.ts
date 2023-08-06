import handleError from '~/model/handleError';
import SearcherORM from '~/model/orm/Searcher';
import { DBSearcherType } from '~/types/Searcher';

export type ContentHashesResultType = {
  sourceId: number;
  sourceDocumentIdentifier: string;
  contentHash: string | null;
};

class SearchersDAO {
  async getAll(): Promise<DBSearcherType[]> {
    try {
      const DBResult = await SearcherORM.findAll({});
      return DBResult.map((e) => e.get({ plain: true }));
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new SearchersDAO();

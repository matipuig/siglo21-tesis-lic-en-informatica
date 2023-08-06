import { Op } from 'sequelize';

import handleError from '~/model/handleError';
import UserSeacherORM from '~/model/orm/UserSearcher';
import SeacherORM from '~/model/orm/Searcher';

export type ContentHashesResultType = {
  sourceId: number;
  sourceDocumentIdentifier: string;
  contentHash: string | null;
};

class SearchersDAO {
  async getUserAuthorizedSearcherNames(userId: number): Promise<string[]> {
    try {
      const DBResult = await UserSeacherORM.findAll({ where: { userId } });
      const searcherIds = DBResult.map((e) => e.get({ plain: true }).searcherId);
      if (searcherIds.length === 0) {
        return [];
      }
      const searchersResults = await SeacherORM.findAll({
        where: { id: { [Op.in]: searcherIds } },
      });
      return searchersResults.map((e) => e.get({ plain: true }).name);
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new SearchersDAO();

import handleError from '~/model/handleError';
import SourceORM from '~/model/orm/Source';
import { DBSourceType } from '~/types/Source';

class SourcesDAO {
  async getById(id: number): Promise<DBSourceType> {
    try {
      const result = await SourceORM.findOne({ where: { id } });
      if (!result) {
        throw new Error(`No existe la fuente id ${id}`);
      }
      return result.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }

  async getByName(name: string): Promise<DBSourceType> {
    try {
      const result = await SourceORM.findOne({ where: { name } });
      if (!result) {
        throw new Error(`No existe la fuente ${name}`);
      }
      return result.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new SourcesDAO();

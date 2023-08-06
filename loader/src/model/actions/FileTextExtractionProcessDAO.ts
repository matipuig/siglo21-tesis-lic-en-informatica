import handleError from '~/model/handleError';
import FileTextExtractionProcessORM from '~/model/orm/FileTextExtractionProcess';
import {
  DBFileTextExtractionProcessType,
  FileTextExtractionProcessStateType,
} from '~/types/FileTextExtractionProcess';

class FileTextExtractionProcessDAO {
  async getFirstByState(
    state: FileTextExtractionProcessStateType,
  ): Promise<DBFileTextExtractionProcessType | null> {
    try {
      const existingProcess = await FileTextExtractionProcessORM.findOne({
        where: { state },
      });
      if (!existingProcess) {
        return null;
      }
      return existingProcess.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }

  async setState(
    fileId: number,
    state: FileTextExtractionProcessStateType = 'NOT_STARTED',
    errorDescription: string | null = null,
  ): Promise<DBFileTextExtractionProcessType> {
    try {
      const newState = { fileId, state, errorDescription };
      const existingProcess = await FileTextExtractionProcessORM.findOne({
        where: { fileId },
      });
      if (!existingProcess) {
        const addedProcess = await FileTextExtractionProcessORM.create(newState);
        return addedProcess.get({ plain: true });
      }
      await FileTextExtractionProcessORM.update(newState, { where: { fileId } });
      const udpatedProcess = await FileTextExtractionProcessORM.findOne({ where: { fileId } });
      if (!udpatedProcess) {
        throw new Error('Ocurrió un error no definido.');
      }
      return udpatedProcess.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new FileTextExtractionProcessDAO();

import OCRProcessDAO from '~/model/actions/OCRProcessDAO';
import { DBOCRProcessType } from '~/types/OCRProcess';

class OCRProcessController {
  async getState(hash: string): Promise<DBOCRProcessType | false> {
    return OCRProcessDAO.getState(hash);
  }

  async getFirstNotStartedFile(): Promise<DBOCRProcessType | false> {
    return OCRProcessDAO.getFirstNotStartedFile();
  }

  async add(hash: string, metadata: string): Promise<DBOCRProcessType> {
    return OCRProcessDAO.add(hash, metadata);
  }

  async setStarted(hash: string): Promise<boolean> {
    return OCRProcessDAO.setStarted(hash);
  }

  async setErrored(hash: string, error: string): Promise<boolean> {
    return OCRProcessDAO.setErrored(hash, error);
  }

  async setFinished(hash: string, text: string): Promise<boolean> {
    return OCRProcessDAO.setFinished(hash, text);
  }

  async setStartedToNotStarted(): Promise<void> {
    return OCRProcessDAO.setStartedToNotStarted();
  }
}

export default new OCRProcessController();

import apiUtils from '~/api/apiUtils';
import schemas from '~/api/schemas';
import filesProcessor from '~/controller/filesProcessor';
import loader from '~/controller/loader';
import { IncomingDocumentType } from '~/types/Document';

type SetTextType = {
  textContent: string;
  metadata: string;
};

type GetContentHashesType = {
  source: string;
  sourceDocumentIdentifiers: string[];
};

class LoaderHandler {
  async getContentHashes(req: any, res: any, next: any): Promise<boolean> {
    try {
      const body = await schemas.validate(req.body, 'GET_CONTENT_HASHES');
      const { source, sourceDocumentIdentifiers } = body as GetContentHashesType;
      const result = await loader.getContentHashesByDocumentId(source, sourceDocumentIdentifiers);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }

  async set(req: any, res: any, next: any): Promise<boolean> {
    try {
      const newDocument = await schemas.validate(req.body, 'NEW_DOCUMENT');
      const result = await loader.set(newDocument as IncomingDocumentType);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }

  async setText(req: any, res: any, next: any): Promise<boolean> {
    try {
      const setTextData = await schemas.validate(req.body, 'SET_TEXT');
      const { metadata, textContent } = setTextData as SetTextType;
      const parsedMetadata = JSON.parse(metadata);
      const { fileId } = parsedMetadata;
      if (!fileId) {
        throw new Error(`No se envidó un fileId válido: ${fileId}...`);
      }
      const result = await filesProcessor.setFileText(fileId, textContent);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }

  async delete(req: any, res: any, next: any): Promise<boolean> {
    try {
      const { source, sourceDocumentIdentifier } = req.params;
      const result = await loader.delete(source, sourceDocumentIdentifier);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }
}

export default new LoaderHandler();

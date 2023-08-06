import crypto from 'crypto';
import fs from 'fs';
import fileType from 'file-type';
import { isNull, omit } from 'lodash';
import path from 'path';

import DocumentsDAO, { ContentHashesResultType } from '~/model/actions/DocumentsDAO';
import FilesDAO from '~/model/actions/filesDAO';

import { DBDocumentType, IncomingDocumentType } from '~/types/Document';
import { DBFileType, FileType } from '~/types/File';
import SourcesDAO from '~/model/actions/SourcesDAO';
import FileTextExtractionProcessDAO from '~/model/actions/FileTextExtractionProcessDAO';
import filesDAO from '~/model/actions/filesDAO';
import searcherService from '~/services/searcher';

const FILES_PATH = path.join(__dirname, '..', '..', 'persisted');

class Loader {
  private _sendToSearcherTimeout: NodeJS.Timeout | undefined;

  constructor() {
    if (!fs.existsSync(FILES_PATH)) {
      fs.mkdirSync(FILES_PATH, { recursive: true });
    }
  }

  start() {
    this._sendToSearcherTimeout = setTimeout(() => this._sendNextDocumentToSearcher(), 2000);
  }

  async getContentHashesByDocumentId(
    source: string,
    sourceDocumentIdentifiers: string[],
  ): Promise<ContentHashesResultType[]> {
    try {
      const DBSource = await SourcesDAO.getByName(source);
      const sourceId = DBSource.id;
      return DocumentsDAO.getContentHashesByDocumentId(sourceId, sourceDocumentIdentifiers);
    } catch (error) {
      throw error;
    }
  }

  async set(incomingDocument: IncomingDocumentType): Promise<DBDocumentType> {
    try {
      const { source } = incomingDocument;
      const DBSource = await SourcesDAO.getByName(source);
      const sourceId = DBSource.id;
      const documentToSet = { sourceId, ...omit(incomingDocument, 'source') };
      const settedDocument = await DocumentsDAO.set(documentToSet);
      const {
        file: { fileName, base64 },
      } = incomingDocument;
      const addedFile = await this._saveFile(settedDocument.id, fileName, base64);
      await FileTextExtractionProcessDAO.setState(addedFile.id);
      return settedDocument;
    } catch (error) {
      throw error;
    }
  }

  async delete(source: string, sourceDocumentIdentifier: string): Promise<boolean> {
    try {
      const { id, microserviceUrl } = await SourcesDAO.getByName(source);
      await searcherService.delete(microserviceUrl, sourceDocumentIdentifier);
      return DocumentsDAO.delete(id, sourceDocumentIdentifier);
    } catch (error) {
      throw error;
    }
  }

  private async _saveFile(
    documentId: number,
    fileName: string,
    base64: string,
  ): Promise<DBFileType> {
    try {
      const fileHash = crypto.createHash('sha256').update(base64).digest('hex');
      const filePath = path.join(FILES_PATH, fileHash);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, base64, { encoding: 'base64' });
      }
      const extension = await fileType.fromFile(filePath);
      const fileExtension = extension?.ext ? extension.ext : '';
      const newFile: FileType = {
        documentId,
        fileName,
        fileHash,
        fileExtension,
        textContent: null,
      };
      await FilesDAO.deleteByDocumentId(documentId);
      return FilesDAO.set(newFile);
    } catch (error) {
      throw error;
    }
  }

  private async _sendNextDocumentToSearcher(): Promise<void> {
    let documentId = 0;
    try {
      if (this._sendToSearcherTimeout) {
        clearTimeout(this._sendToSearcherTimeout);
      }
      const nextToExtract = await DocumentsDAO.getFirstByState('TEXT_EXTRACTED');
      if (!nextToExtract) {
        this._sendToSearcherTimeout = setTimeout(() => this._sendNextDocumentToSearcher(), 2000);
        return;
      }
      const { sourceId, metadata, id, sourceDocumentIdentifier } = nextToExtract;
      documentId = id;
      const file = await filesDAO.getByDocumentId(id);
      const { fileName, textContent } = file;
      if (isNull(textContent)) {
        throw new Error(`El contenido del archivo está vacío!`);
      }
      const base64 = this._getBase64(file);
      const { microserviceUrl } = await SourcesDAO.getById(sourceId);
      console.log(metadata);
      const newDocument = {
        base64,
        fileName,
        metadata: JSON.parse(metadata),
        textContent: textContent,
        sourceId: sourceDocumentIdentifier,
      };
      await searcherService.set(microserviceUrl, newDocument);
      await DocumentsDAO.setState(documentId, 'FINISHED');
    } catch (error) {
      if (documentId !== 0) {
        console.error(error);
        await DocumentsDAO.setState(documentId, 'ERRORED', (error as Error).message);
      }
      console.error(error);
    } finally {
      this._sendToSearcherTimeout = setTimeout(() => this._sendNextDocumentToSearcher(), 2000);
    }
  }

  private _getBase64(file: DBFileType): string {
    const { fileHash } = file;
    const filePath = path.join(FILES_PATH, fileHash);
    return fs.readFileSync(filePath, 'base64');
  }
}

export default new Loader();

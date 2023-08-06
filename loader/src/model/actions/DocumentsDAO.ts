import { Op } from 'sequelize';

import handleError from '~/model/handleError';
import DocumentORM from '~/model/orm/Document';
import { DBDocumentType, DocumentStateType, NewDocumentType } from '~/types/Document';

export type ContentHashesResultType = {
  sourceId: number;
  sourceDocumentIdentifier: string;
  contentHash: string | null;
};

class DocumentsDAO {
  async getFirstByState(state: DocumentStateType): Promise<DBDocumentType | null> {
    try {
      const existingDocument = await DocumentORM.findOne({
        where: { state },
      });
      if (!existingDocument) {
        return null;
      }
      return existingDocument.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }

  async getContentHashesByDocumentId(
    sourceId: number,
    sourceDocumentIdentifiers: string[],
  ): Promise<ContentHashesResultType[]> {
    try {
      const rawDocuments = await DocumentORM.findAll({
        attributes: ['sourceId', 'sourceDocumentIdentifier', 'contentHash'],
        where: { sourceId, sourceDocumentIdentifier: { [Op.in]: sourceDocumentIdentifiers } },
      });
      const existingDocuments = rawDocuments.map((e) => e.get({ plain: true }));
      const existingDocumentIdentifiers = existingDocuments.map((e) => e.sourceDocumentIdentifier);
      const missingDocumentIdentifiers = sourceDocumentIdentifiers.filter(
        (id) => !existingDocumentIdentifiers.includes(id),
      );
      const missingDocuments = missingDocumentIdentifiers.map((sourceDocumentIdentifier) => ({
        sourceId,
        sourceDocumentIdentifier,
        contentHash: null,
      }));
      return [...existingDocuments, ...missingDocuments];
    } catch (error) {
      return handleError(error);
    }
  }

  async set(newDocument: NewDocumentType): Promise<DBDocumentType> {
    try {
      const { sourceId, sourceDocumentIdentifier } = newDocument;
      const existingDocument = await DocumentORM.findOne({
        where: { sourceId, sourceDocumentIdentifier },
      });
      if (!existingDocument) {
        const addedDocument = await DocumentORM.create(newDocument);
        return addedDocument.get({ plain: true });
      }
      await DocumentORM.update(
        { state: 'NOT_STARTED', ...newDocument },
        { where: { sourceId, sourceDocumentIdentifier } },
      );
      const udpatedDocument = await DocumentORM.findOne({
        where: { sourceId, sourceDocumentIdentifier },
      });
      if (!udpatedDocument) {
        throw new Error('Ocurrió un error no definido.');
      }
      return udpatedDocument.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }

  async setState(
    id: number,
    state: DocumentStateType,
    errorDescription: string | null = null,
  ): Promise<DBDocumentType> {
    try {
      await DocumentORM.update({ state, errorDescription }, { where: { id } });
      const udpatedDocument = await DocumentORM.findOne({
        where: { id },
      });
      if (!udpatedDocument) {
        throw new Error('Ocurrió un error no definido.');
      }
      return udpatedDocument.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }

  async delete(sourceId: number, sourceDocumentIdentifier: string): Promise<boolean> {
    try {
      const deletedDocument = await DocumentORM.destroy({
        where: { sourceId, sourceDocumentIdentifier },
      });
      return deletedDocument > 0;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new DocumentsDAO();

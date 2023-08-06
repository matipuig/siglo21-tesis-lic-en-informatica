import { Op } from 'sequelize';

import handleError from '~/model/handleError';
import FileORM from '~/model/orm/File';
import { FileType, DBFileType } from '~/types/File';

export type ContentHashesResultType = {
  fileName: string;
  fileHash: string | null;
}[];

class FilesDAO {
  async set(file: FileType): Promise<DBFileType> {
    try {
      const { documentId, fileName } = file;
      const result = await FileORM.findOne({ where: { documentId, fileName } });
      if (!result) {
        const newFile = await FileORM.create(file);
        return newFile.get({ plain: true });
      }
      await FileORM.update(file, { where: { documentId, fileName } });
      const udpatedDocument = await FileORM.findOne({ where: { documentId, fileName } });
      if (!udpatedDocument) {
        throw new Error('Ha ocurrido un error no definido omdificando el archivo.');
      }
      return udpatedDocument.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }

  async getById(id: number): Promise<DBFileType> {
    try {
      const result = await FileORM.findOne({ where: { id } });
      if (!result) {
        throw new Error(`No se pudo encontrar el archivo ID "${id}"`);
      }
      return result.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }

  async getByDocumentId(documentId: number): Promise<DBFileType> {
    try {
      const result = await FileORM.findOne({ where: { documentId } });
      if (!result) {
        throw new Error(`No se pudo encontrar el archivo con ID de documento "${documentId}"`);
      }
      return result.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }

  async getByFileName(documentId: number, fileName: string): Promise<DBFileType | null> {
    try {
      const result = await FileORM.findOne({
        where: { documentId, fileName },
      });
      if (!result) {
        return null;
      }
      return result.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }

  async getHashesByFileName(
    documentId: number,
    fileNames: string[],
  ): Promise<ContentHashesResultType> {
    try {
      const result = await FileORM.findAll({
        attributes: ['fileName', 'fileHash'],
        where: { documentId, fileName: { [Op.or]: fileNames } },
      });
      const existingResults = result.map((e) => {
        const { fileName, fileHash } = e.get({ plain: true });
        return { fileName, fileHash };
      });
      const existingFilenames = existingResults.map((e) => e.fileName);
      const missingFilenames = fileNames.filter(
        (fileName) => !existingFilenames.includes(fileName),
      );
      const missingFilenamesWithHashes = missingFilenames.map((fileName) => ({
        fileName,
        fileHash: null,
      }));
      return [...existingResults, ...missingFilenamesWithHashes];
    } catch (error) {
      return handleError(error);
    }
  }

  async deleteByDocumentId(documentId: number): Promise<boolean> {
    try {
      const deleted = await FileORM.destroy({ where: { documentId } });
      return deleted > 0;
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new FilesDAO();

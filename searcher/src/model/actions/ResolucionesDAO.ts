import { cloneDeep } from 'lodash';
import sequelize from 'sequelize';
import { Op } from 'sequelize';

import handleError from '~/model/handleError';
import ResolucionORM from '~/model/orm/Resolucion';
import {
  ResolucionType,
  DBResolucionType,
  SearchType,
  ResolucionWithNoTextContentType,
} from '~/types/Resolucion';

export type ColumnValueTypes = {
  year: number[];
  subject: string[];
};

export type SearchResult = {
  page: number;
  itemsPerPage: number;
  results: ResolucionWithNoTextContentType[];
};

class ResolucionDAO {
  async getById(id: number): Promise<DBResolucionType> {
    try {
      const result = await ResolucionORM.findOne({ where: { id } });
      if (!result) {
        throw new Error(`No se pudo encontrar la resolución especificada.`);
      }
      return result.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }

  async getColumnValues(): Promise<ColumnValueTypes> {
    try {
      return {
        year: (await this._getColumnValues('year')) as number[],
        subject: (await this._getColumnValues('subject')) as string[],
      };
    } catch (error) {
      return handleError(error);
    }
  }

  async upsert(resolucion: ResolucionType): Promise<DBResolucionType> {
    try {
      const resolucionData = cloneDeep(resolucion);
      const { sourceId, textContent, fileName } = resolucionData;
      const newTextContent = `${fileName} ${textContent}`
        .normalize('NFD')
        .toLowerCase()
        .replace(/\s+/, '');
      resolucionData.textContent = newTextContent;
      const existingResolucion = await ResolucionORM.findOne({ where: { sourceId } });
      if (existingResolucion) {
        await ResolucionORM.update(resolucionData, {
          where: { sourceId },
        });
        const newResult = await ResolucionORM.findOne({ where: { sourceId } });
        if (!newResult) {
          throw new Error(`No se pudo modifica la resolucion ${sourceId}`);
        }
        return newResult.get({ plain: true });
      }
      const newResolucion = await ResolucionORM.create(resolucionData);
      return newResolucion.get({ plain: true });
    } catch (error) {
      return handleError(error);
    }
  }

  async count(search: SearchType): Promise<number> {
    try {
      const query = this._getQuery(search);
      const result = await ResolucionORM.count({ where: query as any });
      return result;
    } catch (error) {
      return handleError(error);
    }
  }

  async find(search: SearchType): Promise<SearchResult> {
    try {
      const { page, itemsPerPage } = search;
      const query = this._getQuery(search);
      const attributes = ['id', 'file_name', 'file_hash', 'year', 'subject'];
      const limit = itemsPerPage ? itemsPerPage : 25;
      const actualPage = page ? page : 1;
      const offset = (actualPage - 1) * limit;
      const options: Record<string, any> = { attributes, limit, offset };
      if (query.length > 0) {
        options.where = { [Op.and]: query };
      }
      const rawResults = await ResolucionORM.findAll(options);
      const results = rawResults.map((e) => e.get({ plain: true }));
      return {
        results,
        page: actualPage,
        itemsPerPage: limit,
      };
    } catch (error) {
      return handleError(error);
    }
  }

  async delete(sourceId: string): Promise<boolean> {
    try {
      const deleted = await ResolucionORM.destroy({ where: { sourceId } });
      return deleted > 0;
    } catch (error) {
      return handleError(error);
    }
  }

  private async _getColumnValues(column: string): Promise<(string | number)[]> {
    try {
      const result = await ResolucionORM.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col(column)), column]],
      });
      const colValues = result.map((e) => e.get({ plain: true })) as Record<string, unknown>[];
      return colValues.map((e) => e[column] as string | number);
    } catch (error) {
      return handleError(error);
    }
  }

  private _getQuery(search: SearchType): Record<string, unknown>[] {
    const { include, exclude, year, subject } = search;
    const query: any[] = [];
    if (include) {
      query.push({ text_content: { [Op.substring]: include } });
    }
    if (exclude) {
      query.push({ text_content: { [Op.notLike]: `%${exclude}%` } });
    }
    if (subject) {
      query.push({ subject });
    }
    if (year) {
      query.push({ year });
    }
    return query;
  }
}

export default new ResolucionDAO();

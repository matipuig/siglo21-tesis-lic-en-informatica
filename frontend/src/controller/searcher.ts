import { cloneDeep } from 'lodash';

import search from './search';
import backendAPI, { FindResultsType } from '~/services/backendAPI';
import { SearchParamsType } from '~/types/Search';

const executeSearch = async (searchParams: SearchParamsType, withCount = false): Promise<boolean> => {
  const cleanSearchParams = cloneDeep(searchParams);
  try {
    const apiResponse = await backendAPI.search(cleanSearchParams, withCount);
    let findResults: FindResultsType;
    if (withCount) {
      const { find, count } = apiResponse as { find: FindResultsType; count: number };
      findResults = find;
      search.setTotalResultsCount(count);
    } else {
      findResults = apiResponse as FindResultsType;
    }

    const { page, itemsPerPage, results } = findResults;
    search.setResults(results);
    search.setPage(page);
    search.setItemsPerPage(itemsPerPage);
  } catch (error) {
    throw error;
  }
  return true;
};

const searcher = {
  loadColumns: async (): Promise<boolean> => {
    try {
      const apiResponse = await backendAPI.getDistinctColumns();
      search.setColumnValues(apiResponse);
    } catch (error) {
      throw error;
    }
    return true;
  },

  newSearch: async (searchParams: SearchParamsType): Promise<boolean> => {
    const { itemsPerPage } = search.getState();
    search.setSearchParams(searchParams);
    const executeSearchParams = {
      page: 1,
      itemsPerPage,
      ...searchParams,
    };
    return executeSearch(executeSearchParams, true);
  },

  changePage: async (page: number): Promise<boolean> => {
    const { itemsPerPage, searchParams } = search.getState();
    const newSearchParams = {
      page,
      itemsPerPage,
      ...searchParams,
    };
    return executeSearch(newSearchParams, false);
  },

  changeItemsPerPage: async (itemsPerPage: number): Promise<boolean> => {
    const { searchParams } = search.getState();
    const newSearchParams = {
      page: 1,
      itemsPerPage,
      ...searchParams,
    };
    return executeSearch(newSearchParams, false);
  },

  getDownloadURL: (id: number, fileName: string): string => backendAPI.getDownloadURL(id, fileName),
};

export default searcher;

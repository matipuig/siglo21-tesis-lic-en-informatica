import searchActions from '~/state/actions/search';
import { ResultType, ColumnsType, SearchParamsType } from '~/types/Search';

const searchController = {
  getState: () => searchActions.getState(),

  setColumnValues: (columnValues: ColumnsType): boolean => searchActions.setColumnValues(columnValues),

  setSearchParams: (searchParams: SearchParamsType): boolean => searchActions.setSearchParams(searchParams),

  setPage: (page: number): boolean => searchActions.setPage(page),

  setTotalResultsCount: (totalResultsCount: number): boolean => searchActions.setTotalResultsCount(totalResultsCount),

  setItemsPerPage: (itemsPerPage: number): boolean => searchActions.setItemsPerPage(itemsPerPage),

  setResults: (results: ResultType[]): boolean => searchActions.setResults(results),

  reset: (): boolean => searchActions.reset(),
};

export default searchController;

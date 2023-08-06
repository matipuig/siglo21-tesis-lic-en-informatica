import * as search from '~/state/features/searchSlice';
import store from '~/state/store';
import { ResultType, ColumnsType, SearchParamsType } from '~/types/Search';

const get = function get() {
  return store.getState().search;
};

const searchActions = {
  getState: (): search.SearchStateType => get(),

  setColumnValues: (columnValues: ColumnsType): boolean => {
    store.dispatch(search.setColumnValues(columnValues));
    return true;
  },

  setSearchParams: (searchParams: SearchParamsType): boolean => {
    store.dispatch(search.setSearchParams(searchParams));
    return true;
  },

  setPage: (page: number): boolean => {
    store.dispatch(search.setPage(page));
    return true;
  },

  setTotalResultsCount: (totalResultsCount: number): boolean => {
    store.dispatch(search.setTotalResultsCount(totalResultsCount));
    return true;
  },

  setItemsPerPage: (itemsPerPage: number): boolean => {
    store.dispatch(search.setItemsPerPage(itemsPerPage));
    return true;
  },

  setResults: (results: ResultType[]): boolean => {
    store.dispatch(search.setResults(results));
    return true;
  },

  reset: (): boolean => {
    store.dispatch(search.reset());
    return true;
  },
};

export default searchActions;

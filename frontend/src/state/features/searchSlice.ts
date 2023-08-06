/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import CONSTANTS from '~/constants';
import { RootState } from '~/state/store';
import { ResultType, ColumnsType, SearchParamsType } from '~/types/Search';

export type SearchStateType = {
  columnValues: ColumnsType;
  page: number;
  itemsPerPage: number;
  results: ResultType[];
  totalResultsCount: number;
  searchParams: SearchParamsType;
  firstSearchExecuted: boolean;
};

const initialState: SearchStateType = {
  columnValues: {
    year: [],
    subject: [],
  },
  searchParams: {},
  page: 1,
  itemsPerPage: CONSTANTS.SEARCH.DEFAULT_ITEMS_PER_PAGE,
  totalResultsCount: 0,
  results: [],
  firstSearchExecuted: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setColumnValues: (state: SearchStateType, action: PayloadAction<ColumnsType>) => {
      state.columnValues = action.payload;
    },
    setSearchParams: (state: SearchStateType, action: PayloadAction<SearchParamsType>) => {
      state.searchParams = action.payload;
    },
    setPage: (state: SearchStateType, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setTotalResultsCount: (state: SearchStateType, action: PayloadAction<number>) => {
      state.totalResultsCount = action.payload;
    },
    setItemsPerPage: (state: SearchStateType, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },
    setResults: (state: SearchStateType, action: PayloadAction<ResultType[]>) => {
      state.results = action.payload;
      state.firstSearchExecuted = true;
    },
    reset: (state: SearchStateType) => {
      const tmpColumnValues = state.columnValues;
      state = { ...initialState };
      state.columnValues = tmpColumnValues;
      state.searchParams = {};
      return state;
    },
  },
});

export const searchSelector = (state: RootState): SearchStateType => state.search;

export const { setColumnValues, setSearchParams, setPage, setTotalResultsCount, setItemsPerPage, setResults, reset } =
  searchSlice.actions;

export default searchSlice.reducer;

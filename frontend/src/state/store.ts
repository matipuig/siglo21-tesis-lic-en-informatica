import { configureStore } from '@reduxjs/toolkit';

import searchReducer from '~/state/features/searchSlice';

const reducer = {
  search: searchReducer,
};

const store = configureStore({
  reducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

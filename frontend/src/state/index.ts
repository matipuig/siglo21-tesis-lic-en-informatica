import searchActions from './actions/search';
import reduxStore from './store';

export const search = searchActions;
export const store = reduxStore;

const actions = {
  search,
};

export default { actions, store };

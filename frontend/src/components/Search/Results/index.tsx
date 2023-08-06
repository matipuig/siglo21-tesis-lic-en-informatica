import { useSelector } from 'react-redux';

import NoResultsComponent from './NoResults';
import StartingComponent from './Starting';
import WithResultsComponent from './WithResults';
import { searchSelector } from '~/state/features/searchSlice';

export const ResultsComponent = (): JSX.Element => {
  const searchResults = useSelector(searchSelector);
  if (!searchResults.firstSearchExecuted) {
    return <StartingComponent />;
  }
  if (searchResults.results.length === 0) {
    return <NoResultsComponent />;
  }
  return <WithResultsComponent />;
};

export default ResultsComponent;

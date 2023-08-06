import { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { scroller } from 'react-scroll';

import PaginationComponent from './Pagination';
import ResultsInfoComponent from './ResultsInfo';
import ResultsTable from './ResultsTable';
import { searchSelector } from '~/state/features/searchSlice';
// import styles from './index.module.scss';

let firstLoadDone = false;

export const ResultsComponent = (): JSX.Element => {
  // Autofocus on table when search params change.
  useEffect(() => {
    if (!firstLoadDone) {
      firstLoadDone = true;
      return;
    }
    setTimeout(() => scroller.scrollTo('results-table-container', { smooth: true }), 500);
  }, [JSON.stringify(useSelector(searchSelector).searchParams)]);

  return (
    <div id="results-table-container">
      <ResultsInfoComponent />
      <PaginationComponent />
      <ResultsTable />
      <PaginationComponent />
    </div>
  );
};

export default ResultsComponent;

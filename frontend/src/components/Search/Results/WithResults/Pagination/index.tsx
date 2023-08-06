import { Fragment } from 'react';

import { Pagination } from '@material-ui/lab';
import { noop } from 'lodash';
import { useSelector } from 'react-redux';

import styles from './index.module.scss';
import search from '~/controller/search';
import searcher from '~/controller/searcher';
import { searchSelector } from '~/state/features/searchSlice';

const onPageChange = async (object: any, newPage: number): Promise<boolean> => {
  noop(object);
  if (newPage === search.getState().page) {
    return true;
  }
  return searcher.changePage(newPage);
};

export const PaginationComponent = (): JSX.Element => {
  const { totalResultsCount, itemsPerPage, page } = useSelector(searchSelector);
  const pageCount = Math.ceil(totalResultsCount / itemsPerPage);

  if (pageCount === 1) {
    return <Fragment />;
  }

  const hidePrevButton = pageCount <= 1;
  const hideNextButton = pageCount <= 1;

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.pagination}>
        <Pagination
          hidePrevButton={hidePrevButton}
          hideNextButton={hideNextButton}
          page={page}
          count={pageCount}
          onChange={onPageChange}
          color="primary"
          variant="outlined"
        />
      </div>
    </div>
  );
};

export default PaginationComponent;

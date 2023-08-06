import { Select, MenuItem, FormLabel, Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';

import styles from './index.module.scss';
import searcher from '~/controller/searcher';
import { searchSelector } from '~/state/features/searchSlice';

const setItemsPerPage = (event: any) => searcher.changeItemsPerPage(event.target.value);

export const ResultsInfoComponent = (): JSX.Element => {
  const { totalResultsCount, itemsPerPage } = useSelector(searchSelector);
  return (
    <Grid container direction="row" alignItems="center" justify="space-between">
      <FormLabel className={styles.resultsCount}>{`Resultados: ${totalResultsCount}`}</FormLabel>
      <div className={styles.itemsPerPageContainer}>
        <FormLabel className={styles.itemsPerPageLabel}>Items por pàgina</FormLabel>
        <Select value={itemsPerPage} onChange={setItemsPerPage} variant="standard" label="Items por página">
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </div>
    </Grid>
  );
};

export default ResultsInfoComponent;

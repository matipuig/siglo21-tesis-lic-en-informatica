import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { useSelector } from 'react-redux';

import styles from './index.module.scss';
import searcher from '~/controller/searcher';
import { searchSelector } from '~/state/features/searchSlice';

const PDF_IMAGE = '/imgs/pdf.png';

export const ResultsTableComponent = (): JSX.Element => {
  const { results, itemsPerPage, page } = useSelector(searchSelector);
  const indexBase = (page - 1) * itemsPerPage + 1;
  return (
    <TableContainer>
      <Table className={styles.table} size="small">
        <TableHead>
          <TableRow className={styles.row}>
            <TableCell className={`${styles.tableCell} ${styles.hideInSmall}`}>Íncide</TableCell>
            <TableCell className={`${styles.tableCell}`}>Nombre</TableCell>
            <TableCell className={styles.tableCell}>Tipo</TableCell>
            <TableCell className={styles.tableCell}>Año</TableCell>
            <TableCell className={styles.tableCell}>Descargar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result, index) => {
            const tmpResult = result as any;
            const fileName = tmpResult.fileName || tmpResult.file_name;
            return (
              <TableRow className={styles.row} key={result.id}>
                <TableCell className={`${styles.tableCell} ${styles.hideInSmall}`}>{indexBase + index}</TableCell>
                <TableCell className={styles.nameCell}>{fileName}</TableCell>
                <TableCell className={styles.tableCell}>{result.subject}</TableCell>
                <TableCell className={styles.tableCell}>{result.year}</TableCell>
                <TableCell className={styles.tableCell}>
                  <a target="_blank" href={searcher.getDownloadURL(result.id, fileName)} rel="noreferrer">
                    <img alt="descargar" src={PDF_IMAGE} />
                  </a>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResultsTableComponent;

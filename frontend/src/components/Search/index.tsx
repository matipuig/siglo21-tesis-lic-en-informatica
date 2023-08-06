import { Card, CardContent } from '@material-ui/core';
import { noop } from 'lodash';

import ContentSearchForm from './ContentSearchForm';
import styles from './index.module.scss';
import ResultsComponent from './Results';

const ContentSearch = (): JSX.Element => {
  noop();
  return (
    <div className={styles.container}>
      <div className={styles.mobileLogo}>
        <img src="/imgs/logo.png" alt="" />
        <div className={styles.logoLabel}>Logo</div>
      </div>
      <div className={styles.formContainer} data-testid="form-container">
        <Card className={styles.optionsContainer}>
          <CardContent className={styles.optionsContainerCard}>
            <div className={styles.formComponent}>
              <ContentSearchForm />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className={styles.resultsContainer}>
        <ResultsComponent />
      </div>
    </div>
  );
};

export default ContentSearch;

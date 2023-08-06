import styles from './index.module.scss';

export const StartingComponent = (): JSX.Element => (
  <div className={styles.noResults}>Aún no se ha realizado una búsqueda.</div>
);

export default StartingComponent;

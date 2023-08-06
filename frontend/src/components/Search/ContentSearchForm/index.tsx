import { Fragment } from 'react';

import { CircularProgress, FormControl, FormLabel, Button, TextField, Select, MenuItem } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { isArray, noop } from 'lodash';
import { useSelector } from 'react-redux';
import swal from 'sweetalert';

import styles from './index.module.scss';
import search from '~/controller/search';
import searcher from '~/controller/searcher';
import { searchSelector } from '~/state/features/searchSlice';

type ContentSearchFormType = {
  include: string;
  exclude: string;
  year: string;
  subject: string;
};

type CleanContentSearchFormType = {
  include?: string;
  exclude?: string;
  year?: number;
  subject?: string;
};

type OptionValue = {
  label: string;
  value: string;
};

const NONE = 'NO_RESULTS';

const ContentSearchFormComponent = (): JSX.Element => {
  const initialValues: ContentSearchFormType = {
    include: '',
    exclude: '',
    year: NONE,
    subject: NONE,
  };

  const cleanSearchValues = (values: ContentSearchFormType): CleanContentSearchFormType => {
    const searchValues: CleanContentSearchFormType = {};
    if (values.include) {
      searchValues.include = values.include;
    }
    if (values.exclude) {
      searchValues.exclude = values.exclude;
    }
    if (values.year && values.year !== NONE) {
      searchValues.year = Number.parseInt(values.year, 10);
    }
    if (values.subject && values.subject !== NONE) {
      searchValues.subject = values.subject;
    }
    return searchValues;
  };

  const searchResults = useSelector(searchSelector);
  const allColumnValues: any = searchResults.columnValues;
  const getValues = (prop: string): OptionValue[] => {
    const columnValues = allColumnValues[prop] || [];
    return columnValues.map((e: string | number) => ({
      label: e.toString(),
      value: e,
    }));
  };
  const yearOptions = getValues('year');
  const subjectOptions = getValues('subject');

  return (
    <div className={styles.mainContainer} data-testid="form-container">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const searchValues = cleanSearchValues(values);
            await searcher.newSearch(searchValues);
          } catch (error: any) {
            swal('Error', error.message, 'error');
          }
          setSubmitting(false);
        }}
      >
        {({ handleChange, handleSubmit, isSubmitting, values, errors, touched, resetForm }) => (
          <Fragment>
            <img src="/imgs/logo.png" alt="logo" className={styles.logo} />
            <Form onSubmit={handleSubmit}>
              {isArray(noop(handleChange, handleSubmit, isSubmitting, values, errors, touched))}
              <FormControl className={styles.formBox}>
                <FormLabel className={styles.formLabel}>Incluir</FormLabel>
                <Field name="include">
                  {({ field }: any) => <TextField {...field} size="small" variant="outlined" label="Incluir..." />}
                </Field>
                <FormLabel className={styles.formLabel}>Excluir</FormLabel>
                <Field name="exclude">
                  {({ field }: any) => <TextField {...field} size="small" variant="outlined" label="Excluir..." />}
                </Field>
                <FormLabel className={styles.formLabel}>Año</FormLabel>
                <Field name="year">
                  {({ field }: any) => (
                    <Select {...field} className={styles.input} label="Año">
                      <MenuItem value={NONE}>Todos</MenuItem>
                      {yearOptions.map((e) => (
                        <MenuItem key={e.label} value={e.value}>
                          {e.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </Field>
                <FormLabel className={styles.formLabel}>Tipo</FormLabel>
                <Field name="subject">
                  {({ field }: any) => (
                    <Select {...field} className={styles.input} label="Tipo">
                      <MenuItem value={NONE}>Todos</MenuItem>
                      {subjectOptions.map((e) => (
                        <MenuItem key={e.label} value={e.value}>
                          {e.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </Field>
              </FormControl>
              <div className={styles.buttonBox}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    resetForm();
                    search.reset();
                  }}
                >
                  Limpiar
                </Button>
                <Button color="primary" variant="contained" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} /> : 'Buscar'}
                </Button>
              </div>
            </Form>
          </Fragment>
        )}
      </Formik>
    </div>
  );
};

export default ContentSearchFormComponent;

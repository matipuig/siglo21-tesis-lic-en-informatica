import { useEffect, Fragment } from 'react';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';

import searcher from '~/controller/searcher';
import store from '~/state/store';
import '~/scss/globals.scss';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    const start = async () => {
      await searcher.loadColumns();
    };
    start();
  }, []);

  return (
    <Fragment>
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <Provider store={store}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <header className="header">
            <Fragment />
          </header>
          <div className="body">
            <Component {...pageProps} />
          </div>
        </MuiPickersUtilsProvider>
      </Provider>
    </Fragment>
  );
};
export default MyApp;

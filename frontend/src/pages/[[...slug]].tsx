import { Fragment } from 'react';

import Head from 'next/head';

import SearchComponent from '~/components/Search';
import '~/config';

const HomeScreen = () => (
  <Fragment>
    <Head>
      <title>Buscador de resoluciones</title>
    </Head>
    <SearchComponent />
  </Fragment>
);

export default HomeScreen;

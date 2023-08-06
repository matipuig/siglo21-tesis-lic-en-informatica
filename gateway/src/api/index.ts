import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import sessions from 'express-session';

import apiUtils from './apiUtils';
import CONFIG from '~/config';
import { DBSearcherType } from '~/types/Searcher';
import app from '~/app';
import userHandler from './handlers/userHandler';
// import LoaderHandler from './handlers/loader.ts2';

const router = express.Router();

const session = sessions({
  secret: CONFIG.SESSION_SECRET,
  saveUninitialized: true,
  cookie: { secure: false },
  resave: false,
});

const getAPI = (searchers: DBSearcherType[]) => {
  router.use(cors());
  router.use(express.json({ limit: '500mb' }));
  router.use(cookieParser());
  router.use(session);

  router.get('/is_logged_in', userHandler.isLoggedIn);
  router.post('/login', userHandler.login);
  router.get('/logout', userHandler.logout);

  // router.use(userHandler.rejectIfNotAuthorized)

  searchers.forEach((searcher) => {
    const url = `/buscadores/${searcher.name}`;
    app.use(
      url,
      createProxyMiddleware({
        target: searcher.microserviceUrl,
        pathRewrite: { [url]: '' },
      }),
    );
  });
  router.all('*', apiUtils.sendMethodNotFound);
  router.use(apiUtils.handleError);
  return router;
};

export default getAPI;

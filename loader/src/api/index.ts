import express from 'express';

import apiUtils from './apiUtils';
import LoaderHandler from './handlers/loader';

const router = express.Router();

router.use(express.json({ limit: '500mb' }));

router.post('/', LoaderHandler.set);
router.post('/hashes', LoaderHandler.getContentHashes);
router.post('/text', LoaderHandler.setText);
router.delete('/:source/:sourceDocumentIdentifier', LoaderHandler.delete);

router.all('*', apiUtils.sendMethodNotFound);
router.use(apiUtils.handleError);

export default router;

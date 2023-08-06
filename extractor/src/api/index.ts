import express from 'express';

import apiUtils from './apiUtils';
import extractorHandler from './handlers/extractor';

const router = express.Router();

router.use(express.json({ limit: '500mb' }));

router.post('/extract', extractorHandler.extract);

router.all('*', apiUtils.sendMethodNotFound);
router.use(apiUtils.handleError);

export default router;

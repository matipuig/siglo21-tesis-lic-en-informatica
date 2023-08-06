import express from 'express';

import apiUtils from './apiUtils';
import OCRHandler from './handlers/OCR';

const router = express.Router();

router.use(express.json({ limit: '500mb' }));

router.post('/extract', OCRHandler.extract);

router.all('*', apiUtils.sendMethodNotFound);
router.use(apiUtils.handleError);

export default router;

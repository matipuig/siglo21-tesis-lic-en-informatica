import express from 'express';

import apiUtils from './apiUtils';
import IntegratorHandler from './handlers/integator';

const router = express.Router();

router.use(express.json({ limit: '500mb' }));

router.post('/start', IntegratorHandler.start);
router.post('/stop', IntegratorHandler.stop);

router.all('*', apiUtils.sendMethodNotFound);
router.use(apiUtils.handleError);

export default router;

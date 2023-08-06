import cors from 'cors';
import express from 'express';

import apiUtils from './apiUtils';
import ResolucionesHandler from './handlers/resoluciones';

const router = express.Router();

router.use(cors());
router.use(express.json({ limit: '500mb' }));

router.get('/columns', ResolucionesHandler.getColumnValues);
router.get('/file/:id', ResolucionesHandler.getFile);
router.post('/find', ResolucionesHandler.find);
router.post('/find-with-count', ResolucionesHandler.findWithCount);
router.post('/', ResolucionesHandler.upsert);
router.delete('/:id', ResolucionesHandler.delete);

router.all('*', apiUtils.sendMethodNotFound);
router.use(apiUtils.handleError);

export default router;

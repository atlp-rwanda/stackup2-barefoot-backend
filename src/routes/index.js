import express from 'express';
import apiRoutes from './api/index';

const router = express.Router();

router.use('/api', apiRoutes);

export default router;

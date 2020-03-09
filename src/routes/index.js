import express from 'express';
import apiRouter from './api/index';

const allRoutes = express.Router();

allRoutes.use('/api', apiRouter);

export default allRoutes;

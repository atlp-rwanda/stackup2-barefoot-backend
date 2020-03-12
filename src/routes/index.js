import express from 'express';
import apiRouter from './api/index';
import passportRoutes from './passport.routes';

const allRoutes = express.Router();

allRoutes.use('/api', apiRouter);
allRoutes.use(passportRoutes);
export default allRoutes;

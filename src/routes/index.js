import express from 'express';
import apiRouter from './api/index';
// import passportAuthRoutes from './userAuth.router';

const allRoutes = express.Router();

allRoutes.use('/api', apiRouter);
// allRoutes.use(passportAuthRoutes);

export default allRoutes;

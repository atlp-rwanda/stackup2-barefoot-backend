import express from 'express';
import authenticationRouter from './authentication.routes';

const apiRouter = express.Router();

apiRouter.use('/auth', authenticationRouter);

export default apiRouter;

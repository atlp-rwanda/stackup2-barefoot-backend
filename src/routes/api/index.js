import express from 'express';
import authenticationRouter from './authentication.routes';
import profileRouter from './profile.routes';

const apiRouter = express.Router();

apiRouter.use('/auth', authenticationRouter);
apiRouter.use('/profile', profileRouter);

export default apiRouter;

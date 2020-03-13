import express from 'express';
import authenticationRouter from './authentication.routes';
import requestRouter from './request.routes';
import profileRouter from './profile.routes';

const apiRouter = express.Router();

apiRouter.use('/auth', authenticationRouter);
apiRouter.use('/trips', requestRouter);
apiRouter.use('/profile', profileRouter);

export default apiRouter;

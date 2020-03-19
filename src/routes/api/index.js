import express from 'express';
import authenticationRouter from './authentication.routes';
import requestRouter from './request.routes';

const apiRouter = express.Router();

apiRouter.use('/auth', authenticationRouter);
apiRouter.use('/trips', requestRouter);

export default apiRouter;

import express from 'express';
import authenticationRouter from './authentication.routes';
import adminRouter from './admin.routes';

const apiRouter = express.Router();

apiRouter.use('/auth', authenticationRouter);
apiRouter.use('/admin', adminRouter);

export default apiRouter;

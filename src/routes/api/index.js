import express from 'express';
import authenticationRoutes from './authentication.routes';

const router = express.Router();

router.use('/auth', authenticationRoutes);

export default router;

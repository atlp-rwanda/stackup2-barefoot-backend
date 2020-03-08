import express from 'express';
import AuthenticationControler from '../../controllers/authentication.controller';

const { signUp } = AuthenticationControler;

const router = express.Router();

router.post('/signup', signUp);

export default router;

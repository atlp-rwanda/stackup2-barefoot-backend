import express from 'express';
import AuthenticationController from '../../controllers/authentication.controller';
import { bothEmailAndPasswordExist, loginDataExistOnByOne, verifyCredentials } from '../../middlewares/credentialChecker';

const {
  signUp, userLogin
} = AuthenticationController;

const authenticationRouter = express.Router();

authenticationRouter.post('/signup', signUp);
authenticationRouter.post('/login', bothEmailAndPasswordExist, loginDataExistOnByOne, verifyCredentials, userLogin);

export default authenticationRouter;

import express from 'express';
import AuthenticationController from '../../controllers/authentication.controller';
import { bothEmailAndPasswordExist, loginDataExistOnByOne, verifyCredentials } from '../../middlewares/credentialChecker';
import validate from '../../middlewares/appValidation';
import { validateSignup } from '../../middlewares/validations';

const {
  signUp, userLogin, sendResetEmail, updatePassword, verify
} = AuthenticationController;

const authenticationRouter = express.Router();

authenticationRouter.post('/signup', async (req, res, next) => {
  await validate(req, res, next, validateSignup);
}, signUp);
authenticationRouter.post('/login', bothEmailAndPasswordExist, loginDataExistOnByOne, verifyCredentials, userLogin);
authenticationRouter.post('/resetpassword', sendResetEmail);
authenticationRouter.post('/resetpassword/:token', updatePassword);
authenticationRouter.get('/verify', verify);

export default authenticationRouter;

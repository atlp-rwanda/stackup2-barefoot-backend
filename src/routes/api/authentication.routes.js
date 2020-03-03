import express from 'express';
import AuthenticationController from '../../controllers/authentication.controller';
import { bothEmailAndPasswordExist, loginDataExistOnByOne, verifyCredentials } from '../../middlewares/credentialChecker';
import { signupValidation } from '../../middlewares/authValidation';
import passport from '../../config/passport';

const {
  signUp, userLogin, sendResetEmail, updatePassword, verify
} = AuthenticationController;

const authenticationRouter = express.Router();

authenticationRouter.post('/signup', signupValidation, signUp);
authenticationRouter.post('/login', bothEmailAndPasswordExist, loginDataExistOnByOne, verifyCredentials, userLogin);
authenticationRouter.post('/resetpassword', sendResetEmail);
authenticationRouter.post('/resetpassword/:token', updatePassword);
authenticationRouter.get('/verify', verify);

authenticationRouter.get('/facebook', passport.authenticate('facebook'));
authenticationRouter.get('/facebook/callback', passport.authenticate('facebook', { session: false }), AuthenticationController.facebookLogin);
authenticationRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
authenticationRouter.get('/google/callback', passport.authenticate('google', { session: false }), AuthenticationController.googleLogin);

export default authenticationRouter;

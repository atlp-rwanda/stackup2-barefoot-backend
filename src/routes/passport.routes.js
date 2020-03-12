import express from 'express';
import passport from '../config/passport.config';
import authController from '../controllers/auth.controller';

const router = express.Router();
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), authController.facebookLogin);

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), authController.googleLogin);
export default router;

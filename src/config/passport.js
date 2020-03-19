import passport from 'passport';
import dotenv from 'dotenv';
import facebookStrategy from 'passport-facebook';
import strategy from 'passport-google-oauth2';

const FacebookStrategy = facebookStrategy.Strategy;
const GoogleStrategy = strategy.Strategy;

dotenv.config();
/**
 * @param {string} accessToken
 * @param {string} refreshToken
 * @param {object} user
 * @param {object} cb
 * @returns {object} response
 * @description Returns a user
 */
export const facebookCallBack = (accessToken, refreshToken, user, cb) => cb(null, user);
/**
 * @param {object} request
 * @param {string} accessToken
 * @param {string} refreshToken
 * @param {object} user
 * @param {object} cb
 * @returns {object} response
 * @description Returns a user
 */
export const googleCallBack = (request, accessToken, refreshToken, user, cb) => cb(null, user);
passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_APP_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name']
  },
  facebookCallBack
));
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_SECRET,
    callbackURL: process.env.GOOGLE_APP_CALLBACK_URL,
    passReqToCallback: true,
    profileFields: ['id', 'displayName', 'email', 'given_name', 'family_name']
  },
  googleCallBack
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;

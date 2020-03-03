import responseHandlers from '../utils/responseHandlers';
import customMessages from '../utils/customMessages';
import statusCodes from '../utils/statusCodes';
import UserService from '../services/authentication.service';
import utils from '../utils/authentication.utils';

const { errorResponse } = responseHandlers;
const { isPasswordTrue } = utils;


/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns{object} allows next() if email and password exist else it prompts user to enter them
 */
export const bothEmailAndPasswordExist = (req, res, next) => {
  const { email, password, username } = req.body;
  if (email || password || username) {
    next();
  } else {
    errorResponse(res, statusCodes.badRequest, customMessages.loginPasswordAndEmailOrUsernameEmpty);
  }
};


/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns{object} return object of data
 */
export const loginDataExistOnByOne = (req, res, next) => {
  const { email, password, username } = req.body;
  if (email || username) {
    if (password) {
      return next();
    }
     return errorResponse(res, statusCodes.badRequest, customMessages.loginPasswordEmpty);
  } 
  return errorResponse(res, statusCodes.badRequest, customMessages.loginEmailOrUsernameEmpty);
  
};


/**
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {string} it allows the function to execute next() function if credentials are valid
   * @description function verifyCredentials() is checking
   *  if the provided credentials are valid from the database
   */
export const verifyCredentials = async (req, res, next) => {
  const { email, password, username } = req.body;
  try {
    const login = username === undefined ? email : username;
    const gottenUser = await UserService.findUserByEmailOrUsername(login);
    const { dataValues } = gottenUser;
    const passwordFromDb = dataValues.password;
    req.foundUser = dataValues;
    if (await isPasswordTrue(password, passwordFromDb)) {
      next();
    } else {
      errorResponse(res, statusCodes.unAuthorized, customMessages.loginUnauthorized);
    }
  } catch (err) {
    errorResponse(res, statusCodes.badRequest, customMessages.loginFail);
  }
};

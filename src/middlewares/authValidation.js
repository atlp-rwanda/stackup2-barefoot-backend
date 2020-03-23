import Joi from '@hapi/joi';
import statusCodes from '../utils/statusCodes';
import responseHandlers from '../utils/responseHandlers';
import utils from '../utils/authentication.utils';
import customMessages from '../utils/customMessages';

const { errorResponse } = responseHandlers;
const { decodeToken } = utils;
import { validateSignup, validatePassword, displayErrorMessages } from '../utils/validations';

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns{object} return next() if validations pass
 */
const signupValidation = async (req, res, next) => {
  const { error } = validateSignup(req.body);
  displayErrorMessages(error, res, next);
};

// /**
//  * 
//  * @param {object} req 
//  * @param {object} res
//  * @param {object} next 
//  * @returns{object} returns next if the token is valid
//  */
// const authorizeAccess = async (req, res, next) => {
//   const { authorization } = req.headers;
//     try {
//         const token = authorization.split(' ')[1];
//         const authUser = await decodeToken(token);
//     req.authenticatedUser = authUser;
//     next();
//       } catch (err) {
//     errorResponse(res, statusCodes.unAuthorized, customMessages.notAllowedToAccessThisResources);
//     }
// };

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns{object} return next() if validations pass
 */
const passwordValidation = async (req, res, next) => {
  const { error } = validatePassword(req.body);
  if (error) {
    return errorResponse(res, statusCodes.badRequest, customMessages.invalidPassword);
  }
  return next();
};
/**
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} return body assigned to their validation methods
*/
const validateResetEmail = (req, res, next) => {
  const email = req.body;
  const schema = Joi.object({
    email: Joi.string().trim().email().required()
  });
  const { error } = schema.validate(email, {
    abortEarly: false
  });
  if (error) {
    return errorResponse(res, statusCodes.badRequest, customMessages.invalidEmail);
  }
  next();
};

export {
  signupValidation,
  passwordValidation,
  validateResetEmail
};

import { verify } from 'jsonwebtoken';
import { validateSignup } from './validations';
import statusCodes from '../utils/statusCodes';
import responseHandlers from '../utils/responseHandlers';
import utils from '../utils/authentication.utils';
import customMessages from '../utils/customMessages';

const { errorResponse } = responseHandlers;
const { decodeToken } = utils;

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns{object} return next() if validations pass
 */
export const signupValidation = async (req, res, next) => {
    const { error } = validateSignup(req.body);
    if (error) {
        const { details } = error;
    const messages = details.map((err) => err.message.replace(/['"]/g, '')).join(', ');
    return errorResponse(res, statusCodes.badRequest, messages);
  }
    return next();
};

/**
 * 
 * @param {object} req 
 * @param {object} res
 * @param {object} next 
 * @returns{object} returns next if the token is valid
 */
export const authorizeAccess = async (req, res, next) => {
  const { authorization } = req.headers;
    try {
        const token = authorization.split(' ')[1];
        const authUser = await decodeToken(token);
    req.authenticatedUser = authUser;
    next();
      } catch (err) {
    errorResponse(res, statusCodes.unAuthorized, customMessages.notAllowedToAccessThisResources);
    }
};

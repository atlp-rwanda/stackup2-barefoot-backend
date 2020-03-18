/* eslint-disable require-jsdoc */
import { validateSignup, validateRoleAssigning } from './validations';
import statusCodes from '../utils/statusCodes';
import responseHandlers from '../utils/responseHandlers';

const { errorResponse } = responseHandlers;


/**
 * @param {object} error
 * @param {object} res
 * @param {object} next
 * @returns{object} return next() if validations pass
 */
const errorMessage = async (error, res, next) => {
  if (error) {
    const { details } = error;
    const messages = details.map((err) => err.message.replace(/['"]/g, '')).join(', ');
    return errorResponse(res, statusCodes.badRequest, messages);
  }
  return next();
};

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @param {object} validation
 * @returns{object} return next() if validations pass
 */
  const validate = async (req, res, next, validation) => {
    const { error } = validation(req.body);
    await errorMessage(error, res, next);
  };

export default validate;

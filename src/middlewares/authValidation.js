import { validateSignup } from './validations';
import statusCodes from '../utils/statusCodes';
import responseHandlers from '../utils/responseHandlers';

const { errorResponse } = responseHandlers;

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns{object} return next() if validations pass
 */
const signupValidation = async (req, res, next) => {
    const { error } = validateSignup(req.body);
    if (error) {
        const { details } = error;
    const messages = details.map((err) => err.message.replace(/['"]/g, '')).join(', ');
    return errorResponse(res, statusCodes.badRequest, messages);
  }
    return next();
};

export default { signupValidation };

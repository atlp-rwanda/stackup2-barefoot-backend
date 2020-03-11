import responseHandlers from '../utils/responseHandlers';
import messages from '../utils/customMessages';
import statusCodes from '../utils/statusCodes';
import utils from '../utils/authentication.utils';

const { errorResponse } = responseHandlers;
const { readToken } = utils;
/**
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} sends response to the user
 */
export const isUserVerified = async (req, res, next) => {
  const { isVerified } = await req.authenticatedUser;
  if (isVerified) {
    next();
  } else {
    errorResponse(res, statusCodes.forbidden, messages.verifyYourAccount);
  }
};

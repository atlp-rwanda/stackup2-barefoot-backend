import responseHandlers from '../utils/responseHandlers';
import messages from '../utils/customMessages';
import statusCodes from '../utils/statusCodes';

const { errorResponse } = responseHandlers;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {*} next 
 */
export const validatProfilUpdate = (req, res, next) => {
  req.body.isProfileUpdate = true;
  next();
};


/**
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} sends response to the user
 */
const isUserVerified = (req) => {
  const { isVerified } = req.authenticatedUser;
  if (isVerified) {
    return true;
  }
};

/**
 * 
 * @param {req} req 
 * @returns {boolean} bool
 * 
 */
const isEmailUpdate = (req) => {
  const { email, isProfileUpdate } = req.body;
  if (isProfileUpdate && email) {
    return true;
    } 
    return false;
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns{object} next
 */
export const profileReqCheckpoint = async (req, res, next) => {
  if (isUserVerified(req)) {
    if (isEmailUpdate(req)) {
      errorResponse(res, statusCodes.badRequest, messages.changeEmailNotAllowed);
    } else {
      next();
    }
  } else {
    errorResponse(res, statusCodes.forbidden, messages.verifyYourAccount);
  }
};

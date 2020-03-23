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
  if (isEmailUpdate(req)) {
    errorResponse(res, statusCodes.badRequest, messages.changeEmailNotAllowed);
  } else {
    next();
  }
};

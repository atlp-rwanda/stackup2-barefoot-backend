import statusCode from './statusCodes';
import messages from './customMessages';
import socialMediaService from '../services/socialMedia.service';
import responseHandlers from './responseHandlers';
import utils from './authentication.utils';

const {
  generateToken,
} = utils;

const { successResponse } = responseHandlers;

/**
   * @param {object} user request object
   * @returns {object} response json object
   * @description Reponse for passport auth
   */
const passportReponse = async (user) => {
  const isUserFound = await socialMediaService.findUserById(user.social_media_id);
  const token = generateToken(user);
  if (!isUserFound) {
    await socialMediaService.createUser(user);
    return token;
  } else {
    return token;
  }
};
export default passportReponse;

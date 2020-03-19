import socialMediaService from '../services/socialMedia.service';
import userService from '../services/authentication.service';
import utils from './authentication.utils';
import generateEmail from './generateEmail.utils';

const {
  generateToken,
} = utils;

/**
   * @param {object} user request object
   * @returns {object} response json object
   * @description Reponse for passport auth
   */
const passportReponse = async (user) => {
  const email = generateEmail(user.email);
    const UserFoundBySocialMediaId = await socialMediaService.findUserById(user.socialMediaId);
    const UserFoundByEmail = await userService.findUserByEmail(email);
    const token = generateToken(user);
    if (!UserFoundBySocialMediaId && !UserFoundByEmail) {
      await socialMediaService.createUser(user);
      return token;
    } else {
      return token;
    }
  };
export default passportReponse;

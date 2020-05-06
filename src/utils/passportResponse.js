import UserService from '../services/user.service';
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
    const UserFoundBySocialMediaId = await 
      UserService.getOneBy({ socialMediaId: user.socialMediaId });
    const UserFoundByEmail = await UserService.getOneBy({ email });
    const token = generateToken(user);
    if (!UserFoundBySocialMediaId && !UserFoundByEmail) {
      await UserService.saveAll(user);
      return token;
    } else {
      return token;
    }
  };
export default passportReponse;

import models from '../database/models';
import utils from '../utils/authentication.utils';

const { readToken } = utils;
const { user } = models;

/**
 * @description class ProfileService handles everything regarding to profile
 */
export default class ProfileService {
  /**
   * @param{number} requestedProfile
   * @returns{object} user
   */
  static readProfile = async (requestedProfile) => {
    const userData = await user.findOne({ where: { id: requestedProfile } });
    return userData;
  }
}

import models from '../database/models';
import findUser from '../utils/findUser';

/**
 * @description CRUD services for social media users
 */
class SocialMediaUser {
  /**
   * @param {object} data  object
   * @returns {object} response json object
   * @description creates user
   */
  static async createUser(data) {
    const { user } = models;
    const createdUser = await user.create(data);
    return createdUser;
  }

  /**
   * @param {string} social_media_id  id
   * @returns {object} response json object
   * @description found user
   */
  static async findUserById(social_media_id) {
    const result = findUser(social_media_id);
    return result;
  }
}
export default SocialMediaUser;

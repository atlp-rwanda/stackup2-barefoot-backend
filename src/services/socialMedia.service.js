import { Sequelize } from 'sequelize';
import models from '../database/models';
import findUser from '../utils/identifyUser';


const { user } = models;
const sequelize = Sequelize;

/**
 * @description CRUD services for login with passport
 */
class SocialMediaUser {
  /**
   *@description Saves user object in the database
   * @param {object} data User data to save to the database
   * @returns {object}  User object that was saved to the database
    */
   static async createUser(data) {
    const createdUser = await user.create(data);
    return createdUser;
  }

  /**
   *@description Saves user object in the database
   * @param {string} socialMediaId User data to save to the database
   * @returns {object}  User object that was found in the database
    */
  static async findUserById(socialMediaId) {
    const result = findUser(socialMediaId);
    return result;
  }
}
export default SocialMediaUser;

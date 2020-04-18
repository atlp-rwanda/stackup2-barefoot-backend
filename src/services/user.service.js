import models from '../database/models';
import CrudRepository from '../repository/crudRepo';
import findUser from '../utils/identifyUser';

const {
  user
} = models;

/**
 * @param {integer} manager
 * @description Class to handle users
 * @returns {object} user services
 */
class UserService extends CrudRepository {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.model = user;
  }

  /**
   * function findAll() returns all users in db
   * @param {string} email
   * @returns {object} returns a user with the email in params
   */
  findUserByEmail = async (email) => {
    const currUser = findUser(email);
    return currUser;
  };

    /**
   * @param {Number} userId a user id to look for in database
   * @returns {object} returns a user account information
   */
   getUserById = async (userId) => user.findOne({ where: { id: userId } });

   getManagerByLineManager = async (manager) => {
    const result = await user.findAll({ attributes: ['id'], where: { lineManager: manager } });
    return result;
  };
}

export default new UserService();

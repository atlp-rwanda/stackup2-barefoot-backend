import { Sequelize } from 'sequelize';
import models from '../database/models';

const { user } = models;
const sequelize = Sequelize;
/**
 * @param {string} email
 * @returns {object} Object of messages
 * @description Class to handle users
 */
export default class UserService {
  /**
   * @description Saves user object in the database
   * @param {object} data User data to save to the database
   * @returns {object} dataValues User object that was saved to the database
    */
  static handleSignUp = async (data) => {
    const role = 'requester';
    const isVerified = false;
    const newData = {
      ...data,
      role,
      isVerified
    };
    const { dataValues } = await user.create(
      newData,
      {
        fields: [
          'firstName',
          'lastName',
          'username',
          'email',
          'password',
          'gender',
          'address',
          'role',
          'isVerified',
        ],
      },
    );
    return dataValues;
  };

  /**
   * function findAll() returns all users in db
   * @param {string} email
   * @returns {object} returns a user with the email in params
   */
  static findUserByEmail = async (email) => {
    const currUser = await user.findOne({
      where: { email }
    });
    return currUser;
  };

  /**
   * function findOne() returns all users in db
   * @param {string} value
   * @returns {object} returns a user with the value of email or username in params
   */
  static findUserByEmailOrUsername = async value => {
    let currUser = await user.findOne({
      where: { username: value },
    });
    if (!currUser) {
      currUser = await user.findOne({
        where: { email: value },
      });
    }
    return currUser;
  };

  /**
   * function findOne() returns all users in db
   * @param {string} email
   * @returns {object} returns a user with the email in params in lowercase
   */
  static findUserEmailIfExist = async (email) => {
    const currUser = await user.findOne({
      where: {
        email: sequelize.where(sequelize.fn('LOWER', sequelize.col('email')), 'LIKE', `%${email}%`)
    }
  });
    return currUser;
  };

  /**
   * function findAll() returns all users in db
   * @param {string} password
   * @param {string} id
   * @returns {object} returns an updated user
   */
  static updateUserPassword = async (password, id) => {
    const updatedUser = await user.update(
      {
        password
      },
      {
        where: { id }
      }
    );
    return updatedUser;
  }

  static updateIsVerified = async (email) => {
    const update = await user.update(
      { isVerified: true },
      { where: { email } }
    );
    return update;
  }
}

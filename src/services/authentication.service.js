import models from '../database/models';

/**
 * @description Class to handle users
 */
export default class UserService {
  /**
   *@description Saves user object in the database
   * @param {object} data User data to save to the database
   * @returns {object} dataValues User object that was saved to the database
    */
  static handleSignUp = async (data) => {
    const { user } = models;
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
}

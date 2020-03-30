import models from '../models';
import admin from './adminData';
import utils from '../../utils/authentication.utils';

const { passwordHasher } = utils;
const { user } = models;
  /**
   * @description Saves user object in the database
   * @param {object} data User data to save to the database
   * @returns {object} dataValues User object that was saved to the database
    */
   const registerAdmin = async (data) => {
       data.password = await passwordHasher(data.password);
    
    const provider = 'Barefootnomad';
    const newData = {
      ...data,
      provider,
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
          'provider',
          'gender',
          'address',
          'role',
          'isVerified',
        ],
      },
    );
    return dataValues;
  };
  registerAdmin(admin);
  export default registerAdmin;

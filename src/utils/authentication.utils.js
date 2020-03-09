import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

/**
* @param {object} payload
* @returns {object} data
* @description Retrieves form values from request body
*/
const getFormData = async (payload) => {
  const {
    firstName,
    lastName,
    email,
    password,
    gender,
    address,
  } = payload;
  const data = {
    firstName,
    lastName,
    email,
    password,
    gender,
    address,
  };
  return data;
};

/**
* @param {string} password
* @returns {string} hashedPassword
* @description Encrypts a plain-text password
*/
const passwordHasher = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

/**
   * function findAll() returns all users in db
   * @param {string} currPassword
   * @param {string} hashedPassword
   * @returns {bool} it returns a boolean about the password matching status
   */
const isPasswordTrue = async (currPassword, hashedPassword) => {
  const isPasswordChecked = await bcrypt.compare(currPassword, hashedPassword);
  return isPasswordChecked;
};

/**
* @param {object} data
* @returns {string} token
* @description Generate a jwt token
*/
const generateToken = async (data) => {
  const tokenData = _.omit(data, 'password');
  const token = jwt.sign(
    tokenData,
    process.env.JWT_KEY,
    {
      expiresIn: `${process.env.SIGN_UP_TOKEN_EXPIRES_IN}`
    }
  );
  return token;
};

export default {
  getFormData,
  passwordHasher,
  isPasswordTrue,
  generateToken,
};

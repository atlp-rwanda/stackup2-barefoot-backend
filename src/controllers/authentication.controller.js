import _ from 'lodash';
import utils from '../utils/authentication.utils';
import responseHandlers from '../utils/responseHandlers';
import statusCodes from '../utils/statusCodes';
import customMessages from '../utils/customMessages';
import UserService from '../services/authentication.service';
import sendMail from '../utils/email.util';
import { resetMessage, changedMessage } from '../utils/emailMessages';

const {
  passwordHasher,
  generateToken,
  getFormData,
  decodeToken
} = utils;
const { successResponse, errorResponse, updatedResponse } = responseHandlers;
const { handleSignUp, findUserByEmail, updateUserPassword } = UserService;

/**
   * @description User authentication class
   */
export default class AuthenticationController {
  /**
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object} response json object
   * @description User sign up controller
   */
  static async signUp(req, res) {
    try {
      const payload = await getFormData(req.body);
      const password = await passwordHasher(payload.password);
      const dataWithoutPassword = _.omit(payload, 'password');
      const userData = { ...dataWithoutPassword, password };
      const saveUser = await handleSignUp(userData);
      const savedUserObject = _.omit(saveUser, 'password');
      const token = await generateToken(savedUserObject);
      return successResponse(res, statusCodes.created, customMessages.userSignupSuccess, token);
    } catch (error) {
      return errorResponse(res, statusCodes.badRequest, customMessages.userSignupFailed);
    }
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} sends response to the user
   * @description function userLogin() sends the response of successful login
   */
  static userLogin = async (req, res) => {
    const { foundUser } = req;
    const token = await generateToken(foundUser);
    successResponse(res, statusCodes.ok, customMessages.loginSuccess, token);
  };

  /**
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object} response json object
   * @description send reset email controller
   */
  static async sendResetEmail(req, res) {
    const { email } = req.body;
    const {
      intro, instruction, text, outro
    } = resetMessage;
    try {
      const users = await findUserByEmail(email.toLowerCase());
      if (users) {
        const user = users.dataValues;
        const token = await generateToken(user);
        const url = `${token}`;
        await sendMail(user.email, user.firstName, intro, instruction, text, url, outro);
        return successResponse(res, statusCodes.ok, customMessages.resetEmail, token);
      }
      return errorResponse(res, statusCodes.forbidden, customMessages.notExistUser);
    } catch (err) {
      return errorResponse(res, statusCodes.badRequest, customMessages.errorMessage);
    }
  }

  /**
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object} response json object
   * @description update password controller
   */
  static async updatePassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;
    const {
      intro, instruction, text, outro
    } = changedMessage;
    try {
      const userDetails = await decodeToken(token);
      const users = await findUserByEmail(userDetails.email);
      const user = users.dataValues;
      const hashed = await passwordHasher(password);
      await updateUserPassword(hashed, user.id);
      await sendMail(user.email, user.firstName, intro, instruction, text, '#', outro);
      return updatedResponse(res, statusCodes.ok, customMessages.changed);
    } catch (err) {
      return errorResponse(res, statusCodes.badRequest, customMessages.errorMessage);
    }
  }
}

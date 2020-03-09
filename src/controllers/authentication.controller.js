import _ from 'lodash';
import utils from '../utils/authentication.utils';
import responseHandlers from '../utils/responseHandlers';
import statusCodes from '../utils/statusCodes';
import customMessages from '../utils/customMessages';
import UserService from '../services/authentication.service';

const {
  passwordHasher,
  generateToken,
  getFormData,
} = utils;
const { successResponse, errorResponse } = responseHandlers;
const { handleSignUp } = UserService;

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
}

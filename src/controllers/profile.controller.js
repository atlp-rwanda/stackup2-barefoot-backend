import _ from 'lodash';
import ProfileService from '../services/profile.service';
import responseHandlers from '../utils/responseHandlers';
import messages from '../utils/customMessages';
import statusCodes from '../utils/statusCodes';
import utils from '../utils/authentication.utils';
import AuthenticationService from '../services/authentication.service';
import uploadProfilePic from '../utils/profile.utils';

const { successResponse, errorResponse } = responseHandlers;
const { passwordHasher, isPasswordTrue } = utils;
const { findUserByEmailOrUsername } = AuthenticationService;
/**
 * @description class ProfileController handles all profile controllers methods
 */
export default class ProfileController {
  /**
   * @param{object} req
   * @param{object} res
   * @return{object} user
   */
  static displayUserProfile = async (req, res) => {
    const { requestedProfile } = req.params;
    let usernameTosearchInDb;
    if (requestedProfile) {
      usernameTosearchInDb = requestedProfile;
    } else {
      usernameTosearchInDb = req.authenticatedUser.username;
    }
    const profileDataFromDb = await findUserByEmailOrUsername(usernameTosearchInDb);
    if (profileDataFromDb) {
      const { dataValues } = profileDataFromDb;
    const data = _.omit(dataValues, 'password');
    successResponse(res, statusCodes.ok, messages.profileRetrievalSuccess, undefined, data);
    } else {
      errorResponse(res, statusCodes.notFound, messages.profileNotFound);
    }
  }

  /**
   * @param{object} req
   * @param{object} res
   * @returns{object} returns object containing new updated user profile data
   */
  static updateUserProfile = async (req, res) => {
    await uploadProfilePic(req, res);
    const newProfileDataFromUi = req.body;
    
    if (newProfileDataFromUi.username) {
    const { username } = newProfileDataFromUi;
      const checkUsername = await findUserByEmailOrUsername(username);
      if (checkUsername) {
        return errorResponse(res, statusCodes.conflict, messages.usernameExistOrEmpty);
      }
    }
    
    const dataToInsertInDb = _.omit(newProfileDataFromUi, 'password');
    const newUpdatedUser = await ProfileService
      .updateProfile(dataToInsertInDb, req.authenticatedUser.email);
      const data = _.omit(newUpdatedUser.dataValues, 'password');
      return successResponse(res, statusCodes.ok, messages.profileUpdateSuccess, undefined, data);
  }

  /**
   * @param{object} req
   * @param{object} res
   * @param{object} next
   * @returns{object} login
   */
  static changeUserPassword = async (req, res) => {
    const { password, oldPassword } = req.body;
    const { email } = req.authenticatedUser;
    if (oldPassword) {
      const updaterUser = await findUserByEmailOrUsername(email);
      if (await isPasswordTrue(oldPassword, updaterUser.dataValues.password)) {
        const newPassword = await passwordHasher(password);
        const reslt = await ProfileService.changePassword(newPassword, req.authenticatedUser.email);
        successResponse(res, statusCodes.ok, messages.passwordChangeSuccess, undefined, reslt);
      } else {
        errorResponse(res, statusCodes.unAuthorized, messages.incorrectOldPassword);
      }
    } else {
      errorResponse(res, statusCodes.badRequest, messages.loginPasswordEmpty);
    }
  }
}

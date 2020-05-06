import _ from 'lodash';
import responseHandlers from '../utils/responseHandlers';
import messages from '../utils/customMessages';
import statusCodes from '../utils/statusCodes';
import utils from '../utils/authentication.utils';
import UserService from '../services/user.service';
import uploadImg from '../utils/profile.utils';

const { successResponse, errorResponse } = responseHandlers;
const { passwordHasher, isPasswordTrue } = utils;
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
      usernameTosearchInDb = req.sessionUser.username;
    }
    const profileDataFromDb = await UserService.getOneBy({ username: usernameTosearchInDb });
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
    await uploadImg(req, res);
    const newProfileDataFromUi = req.body;

    if (newProfileDataFromUi.username) {
      const { username } = newProfileDataFromUi;
      const checkUsername = await UserService.getOneBy({ username });
      if (checkUsername) {
        return errorResponse(res, statusCodes.conflict, messages.usernameExistOrEmpty);
      }
    }

    const dataToInsertInDb = _.omit(newProfileDataFromUi, 'password');
    const newUpdatedUser = await UserService
      .updateBy(dataToInsertInDb, { email: req.sessionUser.email });
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
    const { email } = req.sessionUser;
    if (oldPassword) {
      const updaterUser = await UserService.getOneBy({ email });
      if (await isPasswordTrue(oldPassword, updaterUser.dataValues.password)) {
        const newPassword = await passwordHasher(password);
        const reslt = await UserService
          .updateBy({ password: newPassword }, { email: req.sessionUser.email });
        successResponse(res, statusCodes.ok, messages.passwordChangeSuccess, undefined, reslt);
      } else {
        errorResponse(res, statusCodes.unAuthorized, messages.incorrectOldPassword);
      }
    } else {
      errorResponse(res, statusCodes.badRequest, messages.loginPasswordEmpty);
    }
  }
}

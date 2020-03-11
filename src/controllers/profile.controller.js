import _ from 'lodash';
import ProfileService from '../services/profile.service';
import responseHandlers from '../utils/responseHandlers';
import messages from '../utils/customMessages';
import statusCodes from '../utils/statusCodes';

const { successResponse, errorResponse } = responseHandlers;
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
    const profileDataFromDb = await ProfileService.readProfile(requestedProfile);
    if (profileDataFromDb) {
      const { dataValues } = profileDataFromDb;
    const dataToSendToUi = _.omit(dataValues, 'password');
    successResponse(res, statusCodes.ok, messages.profileRetrievalSuccess, dataToSendToUi);
    } else {
      errorResponse(res, statusCodes.notFound, messages.profileNotFound);
    }
  }
}

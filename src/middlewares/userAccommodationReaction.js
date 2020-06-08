import _ from 'lodash';
import customMessages from '../utils/customMessages';
import responseHandlers from '../utils/responseHandlers';
import statusCodes from '../utils/statusCodes';
import Validators from '../utils/validators';
import accommodationServiceInstance from '../services/accommodation.service';
import UserAccommodationReactionUtils from '../utils/userAccommodationReaction.utils';

const { errorResponse } = responseHandlers;

const { badRequest } = statusCodes;

const {
  accommodationNotExist,
} = customMessages;

const {
  validateAccommodationId,
} = Validators;

const {
  getAccommodationById,
} = accommodationServiceInstance;

const {
  extractAccommodationIdAndUserId,
} = UserAccommodationReactionUtils;

/** 
* @description a middleware for checking and validating User Accommodation Reactions
*/
export default class UserAccommodationReaction {
  /**
  * @param {Request} req Node/express request
  * @param {Response} res Node/express response
  * @param {NextFunction} next Node/Express Next callback function
  * @returns {NextFunction} next Node/Express Next function
  * @description checks if the provided accommodation exists in db and validates it
  */
  static async checkAccommodationInfo(req, res, next) {
    try {
      const validationOutput = await validateAccommodationId({ accommodationId: req.params.id });
      const { accommodationId } = validationOutput;
      const accommodationExists = !!await getAccommodationById(accommodationId);
      if (!accommodationExists) {
        return errorResponse(res, badRequest, accommodationNotExist);
      }
      return next();
    } catch (validationError) {
      return errorResponse(res, badRequest, validationError.message);
    }
  }
}

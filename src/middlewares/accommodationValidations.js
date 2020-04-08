import Joi from '@hapi/joi';
import userRoles from '../utils/userRoles.utils';
import responseHandlers from '../utils/responseHandlers';
import statusCodes from '../utils/statusCodes';
import customMsg from '../utils/customMessages';
import { validationMethods, displayErrorMessages } from '../utils/validations';
import AccommodationService from '../services/accommodation.service';
import AccommodationRoomService from '../services/accommodationRoom.service';

const { TRAVEL_ADMIN, ACCOMMODATION_SUPPLIER, SUPER_USER, SUPER_ADMIN } = userRoles;
const { errorResponse } = responseHandlers;
const { conflict, forbidden, badRequest, notFound } = statusCodes;


/**
 * 
 * @param {string} message 
 * @param {boolean} isUpdate 
 * @returns {*} validAccNameOrAddress
 * @function
 * @description it returns the validations of accommodation name and address to be used in the 
 * validateAccommodation function
 */
const validAccNameOrAddress = (message, isUpdate) => validationMethods(/^[^-\s][\w\s-]+$/, { 'string.pattern.base': `${message}` }, isUpdate);


/**
* @param {object} accommodationData
* @returns {object} return body assigned to their validation methods
*/
const validateAccommodationData = accommodationData => {
    const { isUpdate } = accommodationData;
  const schema = Joi.object({
      accommodationName:
          validAccNameOrAddress(customMsg.accommodationNameErrorMsg, isUpdate), 
      accommodationAddress:
          validAccNameOrAddress(customMsg.accommodationAddressErrorMsg, isUpdate),
      cost: Joi.number().optional(),
      currency: validAccNameOrAddress(customMsg.currencyErrorMsg, isUpdate)
  });
  return schema.validate(accommodationData, {
    abortEarly: false,
    allowUnknown: true
});
};

/**
 * 
 * @param {*} req 
 * @returns {boolean} true
 * @function 
 * @description it returns true if isCurrentUserAdminOrSupplier=true otherwise, it returns false
 */
const isCurrentUserAdminOrSupplier = req => {
    const { sessionUser } = req;
    let result = false;
    if (sessionUser.role === TRAVEL_ADMIN 
        || sessionUser.role === ACCOMMODATION_SUPPLIER
        || sessionUser.role === SUPER_USER 
        || sessionUser.role === SUPER_ADMIN) {
        result = true;
    } 
    return result;
};

/**
 * @param {object} existingAccom
 * @param {object} res
 * @param {object} next
 * @param {string} message
 * @returns {object} next
 */
const validateAccommodMid = (existingAccom, res, next, message) => {
    if (existingAccom) {
                errorResponse(res, conflict, message);
            } else {
                next();
            }
};

/**
 * @param {*} req
 * @param {*} isUpdate 
 * @param {*} next 
 * @param {*} accName 
 * @param {*} accAddress 
 * @param {*} res 
 * @returns {*} next
 */
const validAccommLast = async (req, isUpdate, next, accName, accAddress, res) => {
    if (req.files) {
        req.files.myImg = req.files.accommodationImage;
    }
    if (isUpdate) {
        next();
    } else {
        const existingAccom = await AccommodationService.getOneBy({
            accommodationName: accName, accommodationAddress: accAddress
        });
        
        validateAccommodMid(existingAccom, res, next, customMsg.accommodationExistsErrMsg);
    }
};

/**
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {*} next
 * @function
 * @description it validates the accommodation data, and accommodation creator and then
 * allows to continue to the accommodation creation if the data are valid
 */
export const validateAccommodation = async (req, res, next) => {
    const { isUpdate } = req;
    req.body.isUpdate = isUpdate;
    const { error } = validateAccommodationData(req.body);
    if (!error) {
        if (isCurrentUserAdminOrSupplier(req)) {
            const accName = req.body.accommodationName;
            const accAddress = req.body.accommodationAddress;
            validAccommLast(req, isUpdate, next, accName, accAddress, res);
    } else {
        errorResponse(res, forbidden, customMsg.notAllowedToCreateAccommodation);
    }
    } else {
        displayErrorMessages(error, res, next);
    }
};

/**
 * @param {integer} accommodationId
 * @param {string} roomNumber
 * @param {object} res
 * @param {object} next
 * @returns {object} next
 */
const checkRoomData = async (accommodationId, roomNumber, res, next) => {
     if (!isNaN(accommodationId)) {
            const accommodation = await AccommodationService.getOneBy({ id: accommodationId });
            if (accommodation) {
                const room = await AccommodationRoomService.getOneBy({ roomNumber });
                validateAccommodMid(room, res, next, customMsg.roomAlreadyExistsErrMsg);
            } else {
                errorResponse(res, notFound, customMsg.accommodationNotExistsErrMsg);
            }
        } else {
            errorResponse(res, badRequest, customMsg.accommodationIdIntegerErrMsg);
        }
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {*} next
 * @function
 * @description it returns next or errorResponse
 */
export const validateAccommodationRoom = async (req, res, next) => {
    const { roomNumber } = req.body;
    const { accommodationId } = req.params;

    if (isCurrentUserAdminOrSupplier(req)) {
        if (roomNumber) {
            checkRoomData(accommodationId, roomNumber, res, next);
        } else { errorResponse(res, badRequest, customMsg.roomNumberEmpty); }
    } else {
        errorResponse(res, forbidden, customMsg.notAllowedToCreateRoom);
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {*} next
 * @description it returns next if everything is okay, otherwise it sends errorResponse to user
 */
export const validateAccommodationId = (req, res, next) => {
    const { id } = req.params;
    if (!isNaN(id)) {
            req.params.id = parseInt(id, 10);
            req.isUpdate = true;
            next();
        } else {
            errorResponse(res, badRequest, customMsg.accommodationIdIntegerErrMsg);
        }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {*} next
 * @description it returns next if everything is okay, otherwise it sends errorResponse to user
 */
export const validateDeleteAccommodation = async (req, res, next) => {
    const { id } = req.params;
    const accommodationRoom = await AccommodationRoomService.getOneBy({ accommodationId: id });
    if (accommodationRoom) {
        errorResponse(res, badRequest, customMsg.cantDltAccommWithRooms);
    } else {
        next();
    }
};

/**
 * @param {*} roomNumber
 * @param {*} res 
 * @param {*} next 
 * @returns {*} next
 */
const checkUpdateRoomData = async (roomNumber, res, next) => {
    if (roomNumber) {
                const roomExist = await AccommodationRoomService.getOneBy({ roomNumber });
                validateAccommodMid(roomExist, res, next, customMsg.roomAlreadyExistsErrMsg);
            } else {
                next();
            }
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {*} next
 * @function
 * @description it returns next if everything is cool, otherwise it sends error response
 */
export const validateUpdateRoom = async (req, res, next) => {
    const { roomNumber } = req.body;
    const { id } = req.params;
    if (isCurrentUserAdminOrSupplier(req)) {
        if (!isNaN(id)) {
            req.params.id = parseInt(id, 10);
            checkUpdateRoomData(roomNumber, res, next);
        } else {
            errorResponse(res, badRequest, customMsg.roomIdShouldBeANumberErrMsg);
        }
    } else {
        errorResponse(res, forbidden, customMsg.notAllowedToUpdateRoom);
    }
};

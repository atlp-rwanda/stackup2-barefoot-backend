import Joi from '@hapi/joi';
import _ from 'lodash';
import customMsg from './customMessages';
import responseHandlers from './responseHandlers';
import statusCodes from './statusCodes';
import utils from './authentication.utils';

const { errorResponse, successResponse } = responseHandlers;
const { decodeToken } = utils;

/**
* @param {string} pattern
* @param {string} messages
* @param {boolean} isProfileUpdate
* @returns {object} a chained validation methods
*/
const validationMethods = (pattern, messages, isProfileUpdate) => {
  const methods = isProfileUpdate ? Joi.string()
    .regex(pattern)
    .messages(messages) : Joi.string()
      .regex(pattern)
      .trim()
      .required()
      .messages(messages);
  return methods;
};

/**
* @param {object} user
* @param {object} isProfileUpdate
* @returns {object} return body assigned to their validation methods
*/
const validateSignup = (user) => {
  const { isProfileUpdate } = user;
  const schema = Joi.object({
    firstName: validationMethods(/^([a-zA-Z]{3,})+$/, { 'string.pattern.base': `${customMsg.invalidFirstname}` }, isProfileUpdate),
    lastName: validationMethods(/^([a-zA-Z]{3,})+$/, { 'string.pattern.base': `${customMsg.invalidLastname}` }, isProfileUpdate),
    username: validationMethods(/^([a-zA-Z0-9@_.-]{3,})+$/, { 'string.pattern.base': `${customMsg.invalidUsername}` }, isProfileUpdate),
    email: validationMethods(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, { 'string.pattern.base': `${customMsg.invalidEmail}` }, isProfileUpdate),
    password: validationMethods(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*?])[0-9a-zA-Z!@#$%^&*?]{8,}$/, { 'string.pattern.base': `${customMsg.invalidPassword}` }, isProfileUpdate),
    gender: validationMethods(/^Male$|^male$|^Female$|^female$/, { 'string.pattern.base': `${customMsg.invalidGender}` }, isProfileUpdate),
    address: validationMethods(/^(\w)+$/, { 'string.pattern.base': `${customMsg.invalidAddress}` }, isProfileUpdate),
  });
  return schema.validate(user, {
    abortEarly: false,
    allowUnknown: true
  });
};

/**
 * @param {object} data
 * @returns {object} Return the validations
 */
const validateRole = (data) => {
  const schema = Joi.object({
    role: validationMethods(
      /^super administrator$|^travel administrator$|^travel team member$|^requester$|^manager|^accommodation supplier$/,
      { 'string.pattern.base': `${customMsg.invalidRole}` }
    ),
    email: validationMethods(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, { 'string.pattern.base': `${customMsg.invalidEmail}` })
  });
  return schema.validate(data, {
    abortEarly: false
  });
};
/**
* @param {object} password
* @returns {object} return body assigned to their validation methods
*/
const validatePassword = password => {
  const schema = Joi.object({
    password: validationMethods(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?])[0-9a-zA-Z!@#$%^&*?]{8,}$/, { 'string.pattern.base': `${customMsg.invalidPassword}` })
  });
  return schema.validate(password, {
    abortEarly: false,
    allowUnknown: true
  });
};

/**
* @param {object} error
* @param {object} res
* @param {object} next
* @returns {object} return body assigned to their validation methods
*/
const displayErrorMessages = (error, res, next) => {
  if (error) {
    const { details } = error;
    const messages = details.map((err) => err.message.replace(/['"]/g, '')).join(', ');
    return errorResponse(res, statusCodes.badRequest, messages);
  }
  return next();
};
/**
* @param {object} req
* @param {object} res
* @param {object} next
* @returns {object} error or next
* @description Verifies if token has not expired
*/
const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    await decodeToken(token);
    next();
  } catch (error) {
    return errorResponse(res, statusCodes.badRequest, customMsg.tokenInvalid);
  }
};

/**
* @param {object} data
* @returns {Object} return data in lowercase
*/
const lowerCase = data => `${data}`.toLowerCase();

 /** 
   * @param {Response} travelFrom 
   * @param {Response} travelTo 
   * @param {Response} travelDate
   * @param {Response} travelType
   * @returns {Object} Custom response with the new trip request details
   */
const arrayErrorChecker = (travelFrom, travelTo, travelDate) => {
  let error = '';
  if (travelTo instanceof Array) {
    if (travelFrom.length !== travelTo.length || travelTo.length !== travelDate.length) {
      error += `; ${customMsg.arrayLengthError}`;
    }  
    travelTo.forEach(item => {
      if (lowerCase(travelFrom[0]) === lowerCase(item)) {
        error += `; ${customMsg.travelFromNETravelTo}`;
      }
    });
  }
  if (error === '') {
    error = '';
  }
  return error;
};

 /**
   * @param {Response} arrayError
   * @param {Response} errorCheck
   * @param {Response} travelType
   * @returns {Object} return error message
   */
  const errorCondition = (arrayError, errorCheck, travelType) => {
    let error = '';
    if (arrayError && travelType === 'multi-city') {
      error += arrayError;
    }
    if (errorCheck && travelType === 'multi-city') {
      error += errorCheck;
    }
    if (error === '') { 
      error = '';
    }
    error = error.indexOf('; ') === 0 ? error.replace('; ', '') : error;
    return error;
  };

  /** 
   * @param {Response} two 
   * @param {Response} one 
   * @returns {Object} return one if two does not exist
   */
  const isSet = (two, one) => {
    if (two !== 'undefined') {
      return two;
    } else {
      return one;
    }
  };

 /** 
   * @param {Response} travelFrom 
   * @param {Response} travelTo 
   * @param {Response} travelDate
   * @returns {Object} Custom response with the new trip request details
   */
  const createTripRequestCondition = (travelFrom, travelTo, travelDate) => {
    let error = '';
    if (lowerCase(travelFrom[1]) !== lowerCase(travelTo[0]) 
    || isSet(lowerCase(travelFrom[2]), lowerCase(travelTo[1])) !== lowerCase(travelTo[1])) {
      error += `; ${customMsg.travelFromEqualError}`;
    } 
    if (travelDate[0] > travelDate[1] || travelDate[1] > travelDate[2]) {
      error += `; ${customMsg.travelDateError}`;
    } 
    
  if (lowerCase(travelTo[0]) === lowerCase(travelTo[1]) 
  || lowerCase(travelTo[1]) === lowerCase(travelTo[2])
  || lowerCase(travelTo[0]) === lowerCase(travelTo[2])) {
error += `; ${customMsg.travelFromNETravelTo}`;
}
    if (error === '') {
      error = '';
    }
      return error;
  };

   /** 
   * @param {Response} requests
   * @param {Response} reqCheck 
   * @param {Response} res
   * @returns {Object} Custom response with the new trip request details
   */
  const refactorRequests = async (requests, reqCheck, res) => {
    if (reqCheck !== 0) {
      const reqRow = requests.rows;
      if (reqRow.length === 0) {
        return errorResponse(res, statusCodes.notFound, customMsg.noRequestsFoundOnThisPage);
      } else {
        const resultToSend = {
          totalRequests: reqCheck,
          foundRequests: reqRow
        };
        return successResponse(
          res, 
          statusCodes.ok, 
          customMsg.requestsRetrieved, 
          null, resultToSend
          );
      }
    } else {
      return errorResponse(res, statusCodes.notFound, customMsg.noRequestsFound);
    }
  };

export {
  arrayErrorChecker, 
  createTripRequestCondition, 
  errorCondition,
  validateSignup,
  validatePassword,
  displayErrorMessages,
  validateRole,
  validationMethods, verifyToken,
  refactorRequests
};

import Joi from '@hapi/joi';
import _ from 'lodash';
import customMessages from './customMessages';
import responseHandlers from './responseHandlers';
import statusCodes from './statusCodes';
import Validators from './validators';
import utils from './authentication.utils';
import userRoles from './userRoles.utils';

const { errorResponse } = responseHandlers;
const { badRequest } = statusCodes;
const {
  invalidTravelType,
  invalidReturnDate,
} = customMessages;
const { decodeToken } = utils;
const { validateOneWayTripRequest, validateReturnDate } = Validators;

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
        firstName: validationMethods(/^([a-zA-Z]{3,})+$/, { 'string.pattern.base': `${customMessages.invalidFirstname}` }, isProfileUpdate),
        lastName: validationMethods(/^([a-zA-Z]{3,})+$/, { 'string.pattern.base': `${customMessages.invalidLastname}` }, isProfileUpdate),
        username: validationMethods(/^([a-zA-Z0-9@_.-]{3,})+$/, { 'string.pattern.base': `${customMessages.invalidUsername}` }, isProfileUpdate),
        email: validationMethods(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, { 'string.pattern.base': `${customMessages.invalidEmail}` }, isProfileUpdate),
        password: validationMethods(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*?])[0-9a-zA-Z!@#$%^&*?]{8,}$/, { 'string.pattern.base': `${customMessages.invalidPassword}` }, isProfileUpdate),
        gender: validationMethods(/^Male$|^male$|^Female$|^female$/, { 'string.pattern.base': `${customMessages.invalidGender}` }, isProfileUpdate),
        address: validationMethods(/^(\w)+$/, { 'string.pattern.base': `${customMessages.invalidAddress}` }, isProfileUpdate),
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
      /^super administrator$|^travel administrator$|^travel team member$|^requester$|^manager$/, 
      { 'string.pattern.base': `${customMessages.invalidRole}` }
),
    email: validationMethods(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, { 'string.pattern.base': `${customMessages.invalidEmail}` })
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
    password: validationMethods(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?])[0-9a-zA-Z!@#$%^&*?]{8,}$/, { 'string.pattern.base': `${customMessages.invalidPassword}` })
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
export const verifyToken = async (req, res, next) => {
  try {
      const { token } = req.params;
      await decodeToken(token);
      next();
  } catch (error) {
    return errorResponse(res, statusCodes.badRequest, customMessages.tokenInvalid);
  }
};
 /** 
 * @param {object}tripRequestInfo Node/express request
 * @param {object} req Node/express request
 * @param {object} res Node/express response
 * @param {object} next Node/Express Next callback function
 * @returns {Object} Custom response with created trip details
 * @description validates all trip requests
 */
const oneWayHandler = async (tripRequestInfo, req, res, next) => {
  try {
    const validationOutput = await validateOneWayTripRequest(tripRequestInfo);
    validationOutput.userId = req.sessionUser.id;
    req.body = validationOutput;
    return next();
  } catch (validationError) {
    return errorResponse(res, badRequest, validationError.message);
  }
};
 /** 
 * @param {object}tripRequestInfo Node/express request
 * @param {object} req Node/express request
 * @param {object} res Node/express response
 * @param {object} next Node/Express Next callback function
 * @returns {Object} Custom response with created trip details
 * @description validates all trip requests
 */
const returnTripHandler = async (tripRequestInfo, req, res, next) => {
  const errorMessage = [];
  let errors = '';
   try {
    const commonInfo = _.omit(tripRequestInfo, 'returnDate');
     await validateOneWayTripRequest(commonInfo);
   } catch (err) {
    errorMessage.push(err.message);
   }
    try {
      const validRequest = await validateReturnDate(tripRequestInfo);
      validRequest.userId = req.sessionUser.id;
      req.body = validRequest;
    } catch (err) {
      errorMessage.push(invalidReturnDate);
}
        if (errorMessage.length === 0) {
          return next(); 
    }
    errorMessage.forEach((element) => {
      errors += `${element}.`;
     });
      return errorResponse(res, badRequest, errors);
};

/**
 * @param {Request} req Node/express request
 * @param {Response} res Node/express response
 * @param {NextFunction} next Node/Express Next callback function
 * @returns {Object} Custom response with created trip details
 * @description validates all trip requests
 */
const validateTripRequest = async (req, res, next) => {
  const tripRequestInfo = req.body;
  let { travelType } = tripRequestInfo;
  if (!travelType) {
    return errorResponse(res, badRequest, invalidTravelType);
  }
  const whiteSpaces = /\s+/g;
  travelType = String(travelType).replace(whiteSpaces, ' ').trim().toLowerCase();
  switch (travelType) {
    case 'one-way':
      return oneWayHandler(tripRequestInfo, req, res, next);
    case 'return-trip':
      return returnTripHandler(tripRequestInfo, req, res, next);
    default:
      return errorResponse(res, badRequest, invalidTravelType);
  }
};

export {
  validateSignup, 
  validateTripRequest, 
  validatePassword,
  displayErrorMessages,
  validateRole,
  validationMethods
};

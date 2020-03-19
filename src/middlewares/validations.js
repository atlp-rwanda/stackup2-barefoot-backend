import Joi from '@hapi/joi';
import _ from 'lodash';
import customMessages from '../utils/customMessages';
import responseHandlers from '../utils/responseHandlers';
import statusCodes from '../utils/statusCodes';
import Validators from '../utils/validators';

const { errorResponse } = responseHandlers;
const { badRequest } = statusCodes;
const { invalidTravelType } = customMessages;
const { validateOneWayTripRequest } = Validators;

/**
* @param {string} pattern
* @param {string} messages
* @returns {object} a chained validation methods
*/
const validationMethods = (pattern, messages) => {
    const methods = Joi.string()
    .regex(pattern)
    .trim()
    .required()
    .messages(messages);
     return methods;
};

/**
* @param {object} user
* @returns {object} return body assigned to their validation methods
*/
const validateSignup = user => {
    const schema = Joi.object({
        firstName: validationMethods(/^([a-zA-Z]{3,})+$/, { 'string.pattern.base': `${customMessages.invalidFirstname}` }),
        lastName: validationMethods(/^([a-zA-Z]{3,})+$/, { 'string.pattern.base': `${customMessages.invalidLastname}` }),
        username: validationMethods(/^([a-zA-Z0-9@_.-]{3,})+$/, { 'string.pattern.base': `${customMessages.invalidUsername}` }),
        email: validationMethods(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, { 'string.pattern.base': `${customMessages.invalidEmail}` }),
        gender: validationMethods(/^Male$|^male$|^Female$|^female$/, { 'string.pattern.base': `${customMessages.invalidGender}` }),
        password: validationMethods(/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/, { 'string.pattern.base': `${customMessages.invalidPassword}` }),
        address: validationMethods(/^(\w)+$/, { 'string.pattern.base': `${customMessages.invalidAddress}` }),
});
    return schema.validate(user, {
    abortEarly: false
  });
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
      try {
        const validationOutput = await validateOneWayTripRequest(tripRequestInfo);
        validationOutput.userId = req.sessionUser.id;
        req.body = validationOutput;
        return next();
      } catch (validationError) {
        return errorResponse(res, badRequest, validationError.message);
      }
    default:
      return errorResponse(res, badRequest, invalidTravelType);
  }
};

export { validateSignup, validateTripRequest, };

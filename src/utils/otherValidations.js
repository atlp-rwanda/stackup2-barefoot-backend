import _ from 'lodash';
import customMessages from './customMessages';
import responseHandlers from './responseHandlers';
import statusCodes from './statusCodes';
import Validators from './validators';

const { errorResponse } = responseHandlers;
const { badRequest } = statusCodes;
const {
  invalidTripRequestId,
  invalidBookAccommodationAccommodationId,
} = customMessages;
const { validateId, validateRates, } = Validators;

/** 
* @param {object} req Node/express request
* @param {object} res Node/express response
* @param {object} next Node/Express Next callback function
* @returns {Object} Custom response with created trip details
* @description validates trip request id
*/
const validateRatingInfo = async (req, res, next) => {
  const errorMessage = [];
  let errors = '';
  try {
    await validateId(req.body.requestId, invalidTripRequestId);
  } catch (err) {
    errorMessage.push(err);
  }
    try {
    await validateRates(req.body.rates);
  } catch (err) {
    errorMessage.push(err);
  }
  if (errorMessage.length === 0) {
    return next();
  }
  errorMessage.forEach((element) => {
    errors += `${element.message}.`;
  });
  return errorResponse(res, badRequest, errors);
};

export {
  validateRatingInfo,
};

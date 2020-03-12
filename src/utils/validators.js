import Joi from '@hapi/joi';
import customMessages from './customMessages';

const { 
  invalidTravelFrom,
  invalidTravelTo,
  invalidTravelReason,
  invalidTravelDate,
  invalidTravelType,
  invalidTravelAccomodation,
 } = customMessages;

/**
* @returns {object} defines custom validators for different kind of API requests
*/
export default class Validators {
/**
* @param {object} fieldDataType data type for the field
* @param {object} errorMessage error message to display
* @returns {object} an object of validation error messages
*/
static createValidationErrors(fieldDataType, errorMessage) {
   return {
    [`${fieldDataType}.base`]: errorMessage,
    [`${fieldDataType}.empty`]: errorMessage,
  };
}

/**
* @param {object} tripRequestData one way trip request data
* @returns {Promise<any>} a Promise of validation output
*/
static async validateOneWayTripRequest(tripRequestData) {
  const whiteSpaces = /\s+/g;
  const { createValidationErrors } = Validators;
  const cleanString = Joi.string().replace(whiteSpaces, ' ').trim().required();
  const schema = Joi.object({
      travelFrom: cleanString
      .messages(createValidationErrors('string', invalidTravelFrom)),
      travelTo: cleanString
      .messages(createValidationErrors('string', invalidTravelTo)),
      travelReason: cleanString
      .messages(createValidationErrors('string', invalidTravelReason)),
      travelDate: Joi.date().required()
      .messages(createValidationErrors('date', invalidTravelDate)),
      accommodation: Joi.bool().required()
      .messages(createValidationErrors('boolean', invalidTravelAccomodation)),
      travelType: cleanString.lowercase()
      .messages(createValidationErrors('string', invalidTravelType)),
  });
  return schema.validateAsync(tripRequestData, { abortEarly: false });
  }
}

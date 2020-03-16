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
    [`${fieldDataType}.min`]: errorMessage,
    [`${fieldDataType}.max`]: errorMessage,
    [`${fieldDataType}.format`]: errorMessage,
    'any.required': errorMessage,
  };
}

/**
* @param {object} tripRequestData one way trip request data
* @returns {Promise<any>} a Promise of validation output
*/
static async validateOneWayTripRequest(tripRequestData) {
  const maxDate = new Date().setHours(0, 0, 0, 0) + 15811200000;
  const minDate = new Date().setHours(0, 0, 0, 0) - 86400000;
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
      travelDate: Joi.date().required().min(minDate).max(maxDate)
      .iso()
      .messages(createValidationErrors('date', invalidTravelDate)),
      accommodation: Joi.bool().required()
      .messages(createValidationErrors('boolean', invalidTravelAccomodation)),
      travelType: cleanString.lowercase()
      .messages(createValidationErrors('string', invalidTravelType)),
  });
  return schema.validateAsync(tripRequestData, { abortEarly: false });
  }

/**
* @param {object} tripRequest return trip request data
* @returns {Promise<any>} a Promise of validation output
*/
static async validateReturnDate(tripRequest) {
  const { createValidationErrors } = Validators;
  const schema = Joi.object({
    returnDate: Joi.date().required().min(new Date()).iso()
.min(Joi.ref('travelDate'))
.messages(createValidationErrors('date', invalidTravelDate))
});
return schema.validateAsync(tripRequest, { abortEarly: false, 
  allowUnknown: true });
}
}

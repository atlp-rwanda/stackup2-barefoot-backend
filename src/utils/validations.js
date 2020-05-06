import Joi from '@hapi/joi';
import _ from 'lodash';
import customMsg from './customMessages';
import responseHandlers from './responseHandlers';
import statusCodes from './statusCodes';
import Validators from './validators';
import AccommodationService from '../services/accommodation.service';
import RequestService from '../services/request.service';
import {
  validateSignup, arrayErrorChecker, createTripRequestCondition, errorCondition,
  validatePassword, displayErrorMessages, validateRole, validationMethods, verifyToken
} from './validations-previous';

const { errorResponse } = responseHandlers;

const { badRequest } = statusCodes;
const { 
  validationOTripRequest, 
  validationMTripRequest,
  validateReturnDate,
  validateTripRequestsSearch,
  validateTripRequestsSearchField,
  validateBookAccommodation,
  validateId
} = Validators;

/** 
 * @param {object}tripRequestInfo Node/express request
 * @param {object} req Node/express request
 * @param {object} res Node/express response
 * @param {object} next Node/Express Next callback function
 * @returns {Object} Custom response with created trip details
 */
const returnTripHandler = async (tripRequestInfo, req, res, next) => {
    const errorMessage = [];
    let errors = '';
    try {
      const commonInfo = _.omit(tripRequestInfo, 'returnDate');
      req.body = await validationOTripRequest(commonInfo);
    } catch (err) {
      errorMessage.push(err.message);
    }
    try {
      const validRequest = await validateReturnDate(tripRequestInfo);
      req.body.userId = req.sessionUser.id;
      req.body.returnDate = validRequest.returnDate;
    } catch (err) {
      errorMessage.push(customMsg.invalidReturnDate);
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
   * @param {Request} travelType return travel type
   * @param {Response} tripRequestInfo return req bodies
   * @param {Response} res Node/express response
   * @returns {Object} return specific validation callback
   */
  const travelTypeHandler = async (travelType, tripRequestInfo) => {
    let validationType = null;
    switch (travelType) {
        case 'one-way':
        validationType = await validationOTripRequest(tripRequestInfo);
        return validationType;
        case 'multi-cities':
        validationType = await validationMTripRequest(tripRequestInfo);
        return validationType;   
      default:
        return null;
    }
  };
  
  /**
   * @param {Request} msg Node/express request
   * @returns {Object} Custom response with created trip details
   */
  const validationErr = (msg) => {
  if (msg === undefined) {
    return '';
  } else {
    return msg;
  }
  };
  
  /**
   * @param {Request} req Node/express request
   * @param {Response} res Node/express response
   * @param {NextFunction} next Node/Express Next callback function
   * @returns {Object} Custom response with created trip details
   * @description validates all trip requests
   */
  const isTripRequestValid = async (req, res, next) => {
    const tripRequestInfo = req.body;
    let { travelType } = tripRequestInfo;
    const { travelFrom, travelTo, travelDate } = tripRequestInfo;
    const whiteSpaces = /\s+/g;
    travelType = String(travelType).replace(whiteSpaces, ' ').trim().toLowerCase();
    if (travelType === 'return-trip') {
      return returnTripHandler(tripRequestInfo, req, res, next);
    } 
    let error = '';
      try {
        const arrayError = await arrayErrorChecker(travelFrom, travelTo, travelDate);
    const errorCheck = await createTripRequestCondition(travelFrom, travelTo, travelDate);
    error = await errorCondition(arrayError, errorCheck, travelType);
        const validationOutput = await travelTypeHandler(travelType, tripRequestInfo);
        if (error !== '') { throw error; }
        if (validationOutput === null) {
          return errorResponse(res, badRequest, customMsg.invalidTravelType);
        }
        validationOutput.userId = req.sessionUser.id;
        req.body = validationOutput;
        return next();
      } catch (validationError) {
        const err = validationErr(validationError.message);
        return errorResponse(res, badRequest, `${err}${error}`);
      }   
  };
  
  /**
   * @param {Request} req Node/express request
   * @param {Response} res Node/express response
   * @param {NextFunction} next Node/Express Next callback function
   * @returns {Object} nex function
   * @description validates search fields
   */
  const isTripRequestsSearchValid = async (req, res, next) => {
    try {
      const { field, search, limit, offset } = req.query;
      const whiteSpaces = /\s+/g;
      const validSearchTerm = String(search).replace(whiteSpaces, ' ').trim();
      const validSearch = await validateTripRequestsSearch({
        field,
        search: validSearchTerm,
        limit,
        offset,
      });
      const { field: searchField, search: searchFieldValue } = validSearch;
      if (['id', 'travelDate', 'returnDate', 'status', 'travelType'].includes(searchField)) {
        await validateTripRequestsSearchField(searchField, searchFieldValue);
      }
      req.query = validSearch;
      return next();
    } catch (validationError) {
      return errorResponse(res, badRequest, validationError.message);
    }
  };
  
  /**
  * @param {Request} req Node/express request
  * @param {Response} res Node/express response
  * @param {NextFunction} next Node/Express Next callback function
  * @returns {NextFunction} next Node/Express Next function
  */
  const checkAccommodationBookingInfo = async (req, res, next) => {
    try {
      const bookingInfo = req.body;
      const validBookingInfo = await validateBookAccommodation(bookingInfo);
      const {
        accommodationId,
        tripRequestId,
      } = validBookingInfo;
      const accommodationExists = !!await AccommodationService.getOneBy({ id: accommodationId });
      const tripRequestExists = !!await RequestService.getOneBy({ id: tripRequestId });
      if (!accommodationExists) {
        return errorResponse(res, badRequest, customMsg.accommodationNotExist);
      }
      if (!tripRequestExists) {
        return errorResponse(res, badRequest, customMsg.tripRequestNotExist);
      }
      return next();
    } catch (validationError) {
      return errorResponse(res, badRequest, validationError.message);
    }
  }; 
  
  /** 
  * @param {object} req Node/express request
  * @param {object} res Node/express response
  * @param {object} next Node/Express Next callback function
  * @returns {Object} Custom response with created trip details
  * @description validates trip request id
  */
  const handleRequestStatusUpdate = async (req, res, next) => {
    const errorMessage = [];
    let errors = '';
    try {
      await validateId(req.params.tripRequestId, customMsg.invalidTripRequestId);
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
  
  /**
  * @param {object} req Trip request status
  * @returns {Object} response message
  * @description validates the user email
  */
  const validateUserId = async (req) => {
    const data = {
      tripRequestId: req.params.tripRequestId,
      userId: req.body.userId
    };
    const { createValidationErrors } = Validators;
    const schema = Joi.object({
      tripRequestId: Joi.number().integer().required()
        .messages(createValidationErrors('number', customMsg.invalidTripRequestId)),
      userId: validationMethods(/^([0-9])+$/, { 'string.pattern.base': `${customMsg.invalidUserId}` }),
    });
    return schema.validate(data, {
      abortEarly: false,
    });
  };
  
  /** 
  * @param {object} req Node/express request
  * @param {object} res Node/express response
  * @param {object} next Node/Express Next callback function
  * @returns {Object} response error object
  * @description validates trip request reassignment
  */
  const handleRequestReassignment = async (req, res, next) => {
    const validator = await validateUserId(req);
    const { error } = validator;
    displayErrorMessages(error, res, next);
  };

  export {
    validateSignup, isTripRequestValid, validatePassword, displayErrorMessages, validateRole,
     validationMethods, isTripRequestsSearchValid, checkAccommodationBookingInfo, 
     handleRequestStatusUpdate, handleRequestReassignment, verifyToken
  };

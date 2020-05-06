import statusCodes from '../utils/statusCodes';
import customMessages from '../utils/customMessages';
import responseHandler from '../utils/responseHandlers';
import RequestService from '../services/request.service';
import AccommodationService from '../services/accommodation.service';
import BookAccommodationService from '../services/bookAccommodationService.service';

const { errorResponse } = responseHandler;
const { badRequest } = statusCodes;
const { 
    notAssociated, 
    requestNotExists,
    notBookingOwner,
    beforeTripDate, 
} = customMessages;
// const { findTripRequestById } = RequestService;
const { 
  getBookedAccommodationByRequestId, 
} = AccommodationService;
/**
 * @param {Request} req Node/Express Request object
 * @param {Response} res Node/Express Response object
 * @param {NextFunction} next Node/Express Next callback function
 * @returns {NextFunction | Object} Node/Express Next callback function or an error response
 * @description Checks if an accommodation exists, was booked and if you are the owner
 * get request id from request body, checks if the request exist or not
 */
const isTripRequestValidIsYours = async (req, res, next) => {
  const tokenDecoded = req.sessionUser;
  const request = await RequestService.getOneBy({ id: req.body.requestId });
  if (!request) {
      return errorResponse(res, badRequest, requestNotExists);
  }
  const { dataValues } = request;
  if (tokenDecoded.id !== request.dataValues.userId) {
    return errorResponse(res, badRequest, notBookingOwner);
  }
  req.request = dataValues;
  next();
};
/**
 * 
 * @param {Request} req Node/Express Request object
 * @param {Response} res Node/Express Response object
 * @param {NextFunction} next Node/Express Next callback function
 * @returns {NextFunction | Object} Node/Express Next callback function or an error response
 * @description Checks if an accommodation exists, was booked and if you are the owner
 * get request id from request body, checks if the request exist or not
 */
const didRequestBookAccommodation = async (req, res, next) => {
    // const booking = await getBookedAccommodationByRequestId(req.body.requestId);
    const booking = await BookAccommodationService.getOneBy({ tripRequestId: req.body.requestId });
    if (!booking) {
          return errorResponse(res, badRequest, notAssociated);
    }
    const { dataValues } = booking;
    req.booking = dataValues;
    next();
};
  /**
 * @param {Request} req Node/Express Request object
 * @param {Response} res Node/Express Response object
 * @param {NextFunction} next Node/Express Next callback function
 * @returns {NextFunction | Object} Node/Express Next callback function or an error response
 * @description Checks if an accommodation exists, was booked and if you are the owner
 * get request id from request body, checks if the request exist or not
 */
const rateTheAccommodation = async (req, res, next) => {
  const tokenDecoded = req.sessionUser;
  const currentDate = new Date();
  const { booking } = req;

  const accommodationArrivalDate = new Date(booking.arrivalDate);
  if (accommodationArrivalDate > currentDate) {
    return errorResponse(res, badRequest, beforeTripDate);
  }
  req.body = {
      ...req.body,
      accommodationId: booking.accommodationId,
      createdBy: tokenDecoded.id
  };
  next();
};

  export default { 
    didRequestBookAccommodation, 
    rateTheAccommodation, 
    isTripRequestValidIsYours 
  };

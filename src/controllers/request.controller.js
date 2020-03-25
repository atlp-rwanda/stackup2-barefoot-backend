import { Request, Response } from 'express';
import responseHandlers from '../utils/responseHandlers';
import statusCodes from '../utils/statusCodes';
import customMessages from '../utils/customMessages';
import RequestService from '../services/request.service';
import userService from '../services/authentication.service';
import sendEmail from '../services/sendEmail.service';
import { createTripMessage } from '../utils/emailMessages';

const {
  handleTripRequest,
  getMostTraveledDestinations,
  acceptRequest,
  findAllTrips,
  findtrip } = RequestService;
const {
  oneWayTripRequestCreated, emptyReqId,
  duplicateTripRequest, placesRetrieved, noPlacesRetrieved,
  allPendingTrip,
  forbiddenAccess,
  
  tripFound
 } = customMessages;
const { created, badRequest, ok, notFound, forbidden } = statusCodes;
const { successResponse, errorResponse, } = responseHandlers;
const { findUserByEmail } = userService;

/**
   * @description Trip requests controller class
   */
export default class RequestController {
  /**
   * @param {Request} req Node/express request
   * @param {Response} res Node/express response
   * @returns {Object} Custom response with the new trip request details
   * @description creates trip requests
   */
  static async createTripRequest(req, res) {
    try {
      const requestData = req.body;
      const { email, firstName } = req.sessionUser;
      const newTrip = await handleTripRequest(requestData);
      const user = await findUserByEmail(email);
      if (user.emailNotification) {
        await sendEmail.sendNotificationEmail(
          email,
          firstName,
          `${process.env.APP_URL}/api/trips/${newTrip.id}`,
          createTripMessage,
          'Trip Request'
        );
      }
      return successResponse(res, created, oneWayTripRequestCreated, undefined, newTrip);
    } catch (dbError) {
      console.log(dbError);
      return errorResponse(res, badRequest, duplicateTripRequest);
    }
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} sends response to user
   */
  static placesAndVisitTimes = async (req, res) => {
    const visitTimes = await getMostTraveledDestinations();
    if (visitTimes[0].length !== 0) {
      const destinations = visitTimes[0];
      const destinationCount = destinations.map(dest => ({ Destination: dest.travelTo,
        timeVisited: dest.count
      }));
      successResponse(res, ok, placesRetrieved, null, destinationCount);
    } else {
      errorResponse(res, notFound, noPlacesRetrieved);
    }
  }

/**
* @param {Request} req Node/express request
* @param {Response} res Node/express response
* @returns {array} array of all pending requests 
* @description creates trip requests
*/
  static async pendingTripRequests(req, res) {
    const { role } = req.sessionUser;
    if (role !== 'manager') {
      return errorResponse(res, forbidden, forbiddenAccess);
    } else {
      const trips = await findAllTrips();
      return successResponse(res, ok, allPendingTrip, undefined, trips);
    }
  }

  /**
* @param {Request} req Node/express request
* @param {Response} res Node/express response
* @returns {object} a trip 
*/
  static async getTrip(req, res) {
    const { id } = req.params;
    const trip = await findtrip(id);
    return successResponse(res, ok, tripFound, undefined, trip);
  }
}

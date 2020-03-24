import { Request, Response } from 'express';
import responseHandlers from '../utils/responseHandlers';
import statusCodes from '../utils/statusCodes';
import customMessages from '../utils/customMessages';
import RequestService from '../services/request.service';

const { handleTripRequest, getMostTraveledDestinations, acceptRequest } = RequestService;
const {
  oneWayTripRequestCreated, emptyReqId,
  duplicateTripRequest, placesRetrieved, noPlacesRetrieved
 } = customMessages;
const { created, badRequest, ok, notFound } = statusCodes;
const { successResponse, errorResponse, } = responseHandlers;

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
      const newTrip = await handleTripRequest(requestData);
      return successResponse(res, created, oneWayTripRequestCreated, undefined, newTrip);
    } catch (dbError) {
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
}

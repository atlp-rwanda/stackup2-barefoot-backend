import { Request, Response } from 'express';
import responseHandlers from '../utils/responseHandlers';
import statusCodes from '../utils/statusCodes';
import customMessages from '../utils/customMessages';
import RequestService from '../services/request.service';
import { offsetAndLimit } from '../utils/comment.utils';
import userRoles from '../utils/userRoles.utils';

const { handleTripRequest, getMostTraveledDestinations, getAllRequests } = RequestService;
const {
  oneWayTripRequestCreated, requestsRetrieved, noRequestsYet, noRequestsFoundOnThisPage,
  duplicateTripRequest, placesRetrieved, noPlacesRetrieved
 } = customMessages;
const { created, badRequest, ok, notFound } = statusCodes;
const { successResponse, errorResponse, } = responseHandlers;
const { REQUESTER } = userRoles;
const { 
  handleSearchTripRequests,
} = RequestService;
const { emptySearchResult } = customMessages;

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

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} response to user
   * @description it responds to user about the list of all requests of a logged-in user
   */
  static getListOfMyRequests = async (req, res) => {
    const { page } = req.query;
    const pageToView = page > 0 ? page : undefined;
    const { offset, limit } = offsetAndLimit(pageToView);
    const userId = req.sessionUser.id;
    const requests = await getAllRequests({ userId, offset, limit });
    const reqNum = requests.count;
    if (reqNum !== 0) {
      const foundReqs = requests.rows;
      if (foundReqs.length === 0) {
        errorResponse(res, notFound, noRequestsFoundOnThisPage);
      } else {
        const resultToSend = {
          totalRequests: reqNum,
          foundRequests: foundReqs
        };
        successResponse(res, ok, requestsRetrieved, null, resultToSend);
      }
    } else {
      errorResponse(res, notFound, noRequestsYet);
    }
  }

  /**
   * @param {Request} req Node/express request
   * @param {Response} res Node/express response
   * @returns {Object} Custom response with trip requests that matches the search criteria/pattern
   * @description searches trip requests
   */
  static async searchTripRequests(req, res) {
    const { id, role } = req.sessionUser;
    const { field, search, limit, offset } = req.query;
    const searchCriteria = {
      field,
      search,
      limit,
      offset,
      userId: role === REQUESTER ? id : undefined,
    };
    const tripRequests = await handleSearchTripRequests(searchCriteria);
    if (tripRequests.length === 0) {
      return successResponse(res, ok, emptySearchResult, undefined, tripRequests);
    }
    return successResponse(res, ok, undefined, undefined, tripRequests);
  }
}

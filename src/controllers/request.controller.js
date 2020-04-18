import { Request, Response } from 'express';
import { omit } from 'lodash';
import { Op } from 'sequelize';
import responseHandlers from '../utils/responseHandlers';
import statusCodes from '../utils/statusCodes';
import customMessages from '../utils/customMessages';
import RequestService from '../services/request.service';
import { offsetAndLimit } from '../utils/comment.utils';
import userRoles from '../utils/userRoles.utils';
import Validators from '../utils/validators';
import { refactorRequests } from '../utils/validations-previous';
import UserService from '../services/user.service';
import tripRequestsStatus from '../utils/tripRequestsStatus.util';
import TripService from '../services/trip.service';
import notificationService from '../services/notification.service';
import handleEmailNotifications from '../utils/handleEmailNotifications.util';
import notificationType from '../utils/notificationType.utils';
import { createTripMessage, managerEmail, updatedRequestEmailRequester, updatedRequestEmailManager } from '../utils/emailMessages';

const { tripRequestCreated, duplicateTripRequest,
  viewStatsUnauthorized, requesterNotRegistered, emptySearchResult } = customMessages;
  const { created, badRequest, ok, notFound, conflict, unAuthorized, forbidden } = statusCodes;
const { TRIP_CREATED, TRIP_UPDATED, TRIP_APPROVED, TRIP_REJECTED,
  TRIP_ASSIGNED } = notificationType;
const { emailTitleRequestUpdate } = customMessages;
const { successResponse, errorResponse, updatedResponse } = responseHandlers;
const { createInAppNotification } = notificationService;
const { getUserById } = UserService;
const { REQUESTER, MANAGER } = userRoles;
const { handleSearchTripRequests, getTripsStats, updateTripRequestStatus, reassignTripRequest
} = RequestService;
const { validateTripsStatsTimeframe, validateRequesterInfo, func, findUserDate } = Validators;
const { ACCEPTED, REJECTED } = tripRequestsStatus;
/**
   * @param {Request} req Node/express request
   * @param {Response} res Node/express response
   * @returns {object} different data depending on the route
 * @description this class deals with requests features
 */
export default class RequestController {
  /**
   * @param {Request} req Node/express request
   * @param {Response} res Node/express response
   * @returns {Object} Custom response with the new trip request details
   * @description creates trip requests
   */
  static async createTripRequest(req, res) {
      const requestData = req.body;
      const { travelType, travelFrom, travelTo, travelDate, returnDate } = requestData;
      const currentUser = req.sessionUser;
      const { lineManager } = req.sessionUser;
      let manager = await getUserById(lineManager);
      manager = manager.dataValues;
      if (await findUserDate(travelDate, req.sessionUser.id)) {
        return errorResponse(res, badRequest, duplicateTripRequest);
      }
      const data1 = omit({ ...requestData }, ['travelDate', 'travelTo', 'travelFrom', 'returnDate']);
      const newTrip = await RequestService.saveAll(data1);
      const tripLink = `${process.env.APP_URL}/api/trips/${newTrip.id}`;
      await handleEmailNotifications(currentUser, createTripMessage, tripLink, 'Trip request created');
      await handleEmailNotifications(manager, managerEmail, tripLink, 'Trip request created');
      await createInAppNotification(currentUser, newTrip.id, TRIP_CREATED);
      const reqId = newTrip.id;
        let subTrip = null;
        if (travelType === 'multi-city') {
          const arr = func(travelFrom, travelTo, travelDate, reqId);
          arr.forEach(async item => await TripService.saveAll(item));
          const { dataValues } = newTrip;
          const idObj = { request: { ...dataValues, trips: [...arr] } };
          subTrip = [idObj];
        } else {
          const data2 = { travelFrom, travelTo, travelDate, returnDate, requestId: reqId };
          subTrip = await TripService.saveAll(data2);
        }
        return successResponse(res, created, tripRequestCreated, undefined, subTrip);
    }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} sends response to user
   */
  static placesAndVisitTimes = async (req, res) => {
    const visitTimes = await RequestService.getMostTraveledDestinations();
    if (visitTimes[0].length !== 0) {
      const destinations = visitTimes[0];
      const destinationCount = destinations.map(dest => ({
        Destination: dest.travelTo,
        timeVisited: dest.count
      }));
      successResponse(res, ok, customMessages.placesRetrieved, null, destinationCount);
    } else {
      errorResponse(res, notFound, customMessages.noPlacesRetrieved);
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
    const requests = await RequestService
      .getAndCountAllIncludeAssociation({ userId }, offset, limit);
    const reqNum = requests.count;
    await refactorRequests(requests, reqNum, res);
  }

  static getListOfAllRequests = async (req, res) => {
    const { page } = req.query;
    const pageToView = page > 0 ? page : undefined;
    const { offset, limit } = offsetAndLimit(pageToView);
    const whereObj = {
      [Op.or]: [
        { travelType: 'one-way' },
        { travelType: 'return-trip' },
        { travelType: 'multi-city' }
      ]
    };
    const requests = await RequestService
    .getAndCountAllIncludeAssociation(whereObj, offset, limit);
    const reqCount = requests.count;
     await refactorRequests(requests, reqCount, res);
  }

  /**
 * @param {Request} req Node/express request
 * @param {Response} res Node/express response
 * @returns {Object} Custom response with the updated trip request details
 * @description update open trip request
 */
  static async updateTripRequest(req, res) {
      const requestData = req.body;
      const { travelDate } = requestData;
      const { requestId } = req.params;
      const currentUser = req.sessionUser;
      const requesterEmail = updatedRequestEmailRequester;
      const emailManager = updatedRequestEmailManager;
      const currentLineManager = await getUserById(currentUser.lineManager);
      const lineManager = currentLineManager.dataValues;

      if (await findUserDate(travelDate, req.sessionUser.id)) {
        return errorResponse(res, badRequest, duplicateTripRequest);
      }
    const { travelReason, travelType, accommodation, travelTo, travelFrom, returnDate
    } = requestData;
        await RequestService
            .updateBy({ travelReason, travelType, accommodation }, { id: requestId });
          await TripService
            .updateBy({ travelTo, travelFrom, travelDate, returnDate }, { requestId });
            const link = `${process.env.APP_URL}/api/trips/${requestId}`;
            await createInAppNotification(currentUser, requestId, TRIP_UPDATED);
    await handleEmailNotifications(
      currentUser, requesterEmail, link,
      emailTitleRequestUpdate
    );
    await handleEmailNotifications(
      lineManager,
      emailManager,
      link,
      emailTitleRequestUpdate
    );
        return updatedResponse(res, ok, customMessages.requestUpdated);
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

  /**
  * @param {Request} req Node/express request
  * @param {Response} res Node/express response
  * @returns {Object} trips stats of current user
  * @description retrieves trip requests' stats in a particular time frame for the current user
  */
  static async getUserTripsStats(req, res) {
    const { role } = req.sessionUser;
    const { requesterId } = req.query;
    const { getCurrentUserTripsStats, getAnyUserTripsStats, } = RequestController;
    if (role === REQUESTER || ((role === MANAGER) && !requesterId)) {
      return getCurrentUserTripsStats(req, res);
    } else {
      return getAnyUserTripsStats(req, res);
    }
  }

  /**
  * @param {Request} req Node/express request
  * @param {Response} res Node/express response
  * @returns {Object} trips stats of current user(requester)
  * @description retrieves trip requests' stats in a particular time frame for the current user
  */
  static async getCurrentUserTripsStats(req, res) {
    try {
      const { id } = req.sessionUser;
      const { requesterId } = req.query;
      if (requesterId) {
        const { requesterId: validRequesterId } = await validateRequesterInfo({ requesterId });
        if (validRequesterId !== id) {
          return errorResponse(res, unAuthorized, viewStatsUnauthorized);
        }
      }
      const timeframe = omit(req.query, ['requesterId']);
      const { startDate, endDate, } = await validateTripsStatsTimeframe(timeframe);
      const tripsMade = await getTripsStats(id, startDate, endDate);
      return successResponse(res, ok, undefined, undefined, {
        startDate,
        endDate,
        requesterId: id,
        tripsMade,
      });
    } catch (error) {
      return errorResponse(res, badRequest, error.message);
    }
  }

  /**
  * @param {Request} req Node/express request
  * @param {Response} res Node/express response
  * @returns {Object} trips stats of any user
  * @description retrieves trip requests' stats in a particular timeframe for any user
  */
  static async getAnyUserTripsStats(req, res) {
    try {
      const reqParams = req.query;
      const { requesterId } = await validateRequesterInfo(reqParams);
      const timeframe = omit(reqParams, ['requesterId']);
      const { startDate, endDate } = await validateTripsStatsTimeframe(timeframe);
      const isUserRegistered = !!await UserService.getOneBy({ id: requesterId });
      if (!isUserRegistered) {
        return errorResponse(res, badRequest, requesterNotRegistered);
      }
      const tripsMade = await getTripsStats(requesterId, startDate, endDate);
      return successResponse(res, ok, undefined, undefined, {
        startDate,
        endDate,
        requesterId,
        tripsMade,
      });
    } catch (error) {
      return errorResponse(res, badRequest, error.message);
    }
  }

  /**
   * @param {Request} req Node/express request
   * @param {Response} res Node/express response
   * @returns {Object} Response object with success message
   * @description approves a trip request
   */
  static async approveTripRequest(req, res) {
    const { tripRequestId } = req.params;
    const currentUser = req.sessionUser;
    let manager = await getUserById(currentUser.lineManager);
    manager = manager.dataValues;
    if (req.tripRequestCurrentStatus === ACCEPTED) {
      return errorResponse(res, conflict, customMessages.tripRequestAlreadyApproved);
    }
    if (req.tripRequestCurrentStatus === REJECTED) {
      return errorResponse(res, forbidden, customMessages.tripRequestAlreadyRejected);
    }
    const handledBy = req.sessionUser.id;
    await updateTripRequestStatus(tripRequestId, ACCEPTED, handledBy);
    await createInAppNotification(currentUser, tripRequestId, TRIP_APPROVED);
    return successResponse(res, ok, customMessages.requestApprovalSuccess, undefined, undefined);
  }

  /**
   * @param {Request} req Node/express request
   * @param {Response} res Node/express response
   * @returns {Object} Response object with success message
   * @description rejects a trip request
   */
  static async rejectTripRequest(req, res) {
    const { tripRequestId } = req.params;
    const currentUser = req.sessionUser;
    if (req.tripRequestCurrentStatus === REJECTED) {
      return errorResponse(res, conflict, customMessages.tripRequestAlreadyRejected);
    }
    await updateTripRequestStatus(tripRequestId, REJECTED, req.sessionUser.id);
    await createInAppNotification(currentUser, tripRequestId, TRIP_REJECTED);
    return successResponse(res, ok, customMessages.requestRejectionSuccess, undefined, undefined);
  }

  /**
   * @param {Request} req Node/express request
   * @param {Response} res Node/express response
   * @returns {Object} Response object with success or error message
   * @description assigns trip request to another manager
   */
  static async assignTripRequest(req, res) {
    const { tripRequestId } = req.params;
    const newManagerId = req.newManager.id;
    const currentUser = req.sessionUser;
    if (newManagerId === req.tripRequestData.handledBy) {
      return errorResponse(res, conflict, customMessages.tripRequestReassignConflict);
    }
    await reassignTripRequest(tripRequestId, newManagerId);
    await createInAppNotification(currentUser, tripRequestId, TRIP_ASSIGNED);
    return successResponse(
      res,
      ok,
      customMessages.tripRequestReassignSuccess,
      undefined,
      undefined
    );
  }
}

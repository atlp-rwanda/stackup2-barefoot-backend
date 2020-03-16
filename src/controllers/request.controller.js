import { Request, Response } from 'express';
import responseHandlers from '../utils/responseHandlers';
import statusCodes from '../utils/statusCodes';
import customMessages from '../utils/customMessages';
import RequestService from '../services/request.service';

const { handleTripRequest, } = RequestService;
const {
  oneWayTripRequestCreated, 
  duplicateTripRequest,
 } = customMessages;
const { created, badRequest, } = statusCodes;
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
}

import _ from 'lodash';
import requestService from '../services/request.service';
import responseHandler from '../utils/responseHandlers';
import statusCodes from '../utils/statusCodes';
import customMessages from '../utils/customMessages';
import requestStatus from '../utils/tripRequestsStatus.util';

  const { getOneRequestFromDb } = requestService;
  const { errorResponse } = responseHandler;
  const { notExistRequest, notYourRequest, notOpenRequest, emptyUpdate } = customMessages;
  const { badRequest } = statusCodes;
  const { PENDING } = requestStatus;

  /**
   * @param {String/Date} newData Node/Express Request object
   * @param {String/Date} existingData Node/Express Response object
   * @returns {String/Date} Node/Express Next callback function or an error response
   * @description Checks if request exists,
   * get request id from request parameter, checks if the request exist or not
   */
  const checkData = async (newData, existingData) => (
      newData !== undefined ? newData : existingData
      ); 

  /**
   * @param {Request} req Node/Express Request object
   * @param {Response} res Node/Express Response object
   * @param {NextFunction} next Node/Express Next callback function
   * @returns {NextFunction | Object} Node/Express Next callback function or an error response
   * @description Checks if request exists,
   * get request id from request parameter, checks if the request exist or not
   */
const isRequestValid = async (req, res, next) => {
    const { requestId } = req.params;
    const result = await getOneRequestFromDb(requestId);
    if (Object.keys(req.body).length === 0) {
        return errorResponse(res, badRequest, emptyUpdate);
    }
    if (!result) {
        return errorResponse(res, badRequest, notExistRequest);
    }
    const { dataValues } = result;
    req.requestOwner = dataValues.userId;
    req.requestStatus = dataValues.status;
    req.body = {
        travelTo: await checkData(req.body.travelTo, dataValues.travelTo),
        travelFrom: await checkData(req.body.travelFrom, dataValues.travelFrom),
        travelType: await checkData(req.body.travelType, dataValues.travelType),
        travelDate: await checkData(req.body.travelDate, dataValues.travelDate),
        returnDate: await checkData(req.body.returnDate, dataValues.returnDate),
        travelReason: await checkData(req.body.travelReason, dataValues.travelReason),
        accommodation: await checkData(req.body.accommodation, dataValues.accommodation)
    };
    next();
}; 

  /**
   * @param {Request} req Node/Express Request object
   * @param {Response} res Node/Express Response object
   * @param {NextFunction} next Node/Express Next callback function
   * @returns {NextFunction | Object} Node/Express Next callback function or an error response
   * @description Checks if request exists,
   * get request id from request parameter, checks if the request exist or not
   */
  const isRequestOpenIsRequestYours = async (req, res, next) => {
    const tokenDecoded = req.sessionUser;
    const owner = req.requestOwner;
    const status = req.requestStatus;
    if (tokenDecoded.id !== owner) {
        return errorResponse(res, badRequest, notYourRequest);
    }
    if (status !== PENDING) {
        return errorResponse(res, badRequest, notOpenRequest);
    }
    if (!req.body.returnDate) {
        req.body = _.omit(req.body, 'returnDate');
    }
    next();
  };

  export default {
      isRequestOpenIsRequestYours,
      isRequestValid,
  };

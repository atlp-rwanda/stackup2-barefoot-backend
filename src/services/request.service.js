import models from '../database/models';
import tripRequestsStatus from '../utils/tripRequestsStatus.util';

const { request, sequelize, Sequelize } = models;
const { Op } = Sequelize;
const { ACCEPTED, } = tripRequestsStatus;

/**
 * @description Trip requests service
 */
export default class RequestService {
  /**
   *@description Saves trip request details in database
   * @param {Object} tripRequestData trip request data
   * @returns {Object} Saved trip request details
    */
  static handleTripRequest(tripRequestData) {
    return request.create(
      tripRequestData,
      {
        fields: [
          'userId',
          'travelTo',
          'travelFrom',
          'travelReason',
          'travelType',
          'travelDate',
          'returnDate',
          'accommodation'
        ]
      }
    );
  }

  /**
   * @returns {Integer} returns number of traveled places
   * @description returns all of the destinations a and their appearance times from the database
   */
  static getMostTraveledDestinations = async () => {
    const placeAndTheirVisitTimes = await sequelize.query('SELECT "travelTo", COUNT(*) FROM requests WHERE status =\'accepted\' OR status=\'Accepted\' GROUP BY "travelTo" ORDER BY count DESC');
    
    return placeAndTheirVisitTimes;
  }
  
  /**
   * @param {Integer} userId
   * @returns {object} foundReq
   * @description it returns a one request of a specific user if it is passed userId
   *  otherwise it returns any request
   */
  static getOneRequestFromDb = async (userId) => {
    const foundReq = await request.findOne({ where: { id: { [Op.eq]: userId } } });
    return foundReq;
  }

  /**
   *@param {object} reqOptions
   *@returns {object} reqs
   *@description it returns a list of all request
   */
  static getAllRequests = async (reqOptions) => {
    const { userId, offset, limit } = reqOptions;
    const reqs = await request.findAndCountAll({ where: { userId }, offset, limit, order: [['createdAt', 'DESC']] });
    return reqs;
  }

  /**
   *@description Saves trip request details in database
   * @param {Object} searchCriteria an object of different search options
   * @returns {Object} fields that matches the search keyword 
  */
  static handleSearchTripRequests(searchCriteria) {
    const { field, search, limit, offset, userId } = searchCriteria;
    if (['id', 'travelDate', 'returnDate', 'travelType', 'status'].includes(field)) {
      if (userId) {
        return request.findAll({ where: { userId, [field]: { [Op.eq]: search } }, limit, offset, });
      }
      return request.findAll({ where: { [field]: { [Op.eq]: search } }, limit, offset, });
    }
    if (userId) {
      return request.findAll({ where: { userId, [field]: { [Op.iLike]: `%${search}%` } }, limit, offset, });
    }
    return request.findAll({ where: { [field]: { [Op.iLike]: `%${search}%` } }, limit, offset, });
  }

  /**
  *@description Retrieves trips stats from database
  * @param {Number} userId current user's database id
  * @param {Date} startDate start date for stats
  * @param {Date} endDate end date for stats
  * @returns {Object} trips stats
   */
  static getTripsStats(userId, startDate, endDate) {
    return request.count({
      where: {
        userId,
        status: ACCEPTED,
        travelDate: {
          [Op.between]: [startDate, endDate]
        },
      },
    });
  }

     /**
   *@description update open trip request details in database
   * @param {Object} tripRequestData trip request new data
   * @param {Integer} requestId trip request id
   * @returns {Object} updated trip request details
    */
   static updateTripRequest(tripRequestData, requestId) {
    if (tripRequestData.travelType === 'one-way') {
      tripRequestData.returnDate = null;
    }
    const {
     travelTo,
     travelFrom,
     travelReason,
     travelType,
     travelDate,
     returnDate,
     accommodation
    } = tripRequestData;
   return request.update(
     {
         travelTo,
         travelFrom,
         travelReason,
         travelType,
         travelDate,
         returnDate,
         accommodation
     },
     { where: { id: requestId } }
   );
}
}

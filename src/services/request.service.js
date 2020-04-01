import models from '../database/models';

const { request, sequelize, Sequelize } = models;

const { Op } = Sequelize;

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
}

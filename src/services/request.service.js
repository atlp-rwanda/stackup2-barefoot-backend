import models from '../database/models';

const { request, sequelize } = models;
const commentInclusion = [{
  model: models.comment,
  limit: 2,
  offset: 2,
  attributes: ['id', 'requestId', 'comment', 'createdAt', 'updatedAt']
}];

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
   * @param {Integer} id
   * @param {Integer} userId
   * @returns {object} foundReq
   * @description it returns a one request of a specific user if it is passed userId
   *  otherwise it returns any request
   */
  static getOneRequestFromDb = async (id) => {
    const foundReq = await request.findOne({
      where: { id }
    });
    return foundReq;
  }
}

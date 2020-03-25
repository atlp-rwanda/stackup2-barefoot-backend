import models from '../database/models';

const { request, sequelize } = models;

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
   *@description Saves trip request details in database
   * @returns {Object} all pending requests
    */
  static findAllTrips() {
    return request.findAll({
      where: { status: 'pending' }
    });
  }

    /**
   *@description Saves trip request details in database
   * @param {string} id of a trip
   * @returns {Object} all pending requests
    */
  static findtrip(id) {
    return request.findOne({
      where: { id }
    });
  }
}

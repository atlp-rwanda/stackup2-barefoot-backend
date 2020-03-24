import models from '../database/models';

const { request } = models;

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
}

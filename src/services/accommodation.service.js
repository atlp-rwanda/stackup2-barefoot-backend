import models from '../database/models';

const { booking, accommodation } = models;

/**
 * @description Trip requests service
 */
export default class RequestService {
  /**
   *@description Saves booking information in database
   * @param {Object} bookingInfo trip request data
   * @returns {Object} Saved booking information
    */
  static handleBookAccommodation(bookingInfo) {
    return booking.create(
      bookingInfo,
      {
        fields: [
          'tripRequestId',
          'accommodationId',
          'arrivalDate',
          'departureDate',
        ]
      }
    );
  }

  /**
   *@description retrives accommodation details by id
   * @param {Object} id unique accommodation id
   * @returns {Object} accommodation facility details
    */
  static getAccommodationById(id) {
    return accommodation.findOne({
      where: {
        id,
      }
    });
  }
}

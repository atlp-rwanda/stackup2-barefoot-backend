import models from '../database/models';
import CrudRepository from '../repository/crudRepo';

const { booking, accommodation, accommodationRoom } = models;
const { rating } = models;

/**
 * @description class AccommodationService handles everything regarding to accommodations
 */
class AccommodationService extends CrudRepository {
    /**
     * @constructor
     */
    constructor() {
        super();
        this.model = accommodation;
        this.associateTable = [accommodationRoom, rating];
    }

    /**
   *@description Saves booking information in database
   * @param {Object} bookingInfo trip request data
   * @returns {Object} Saved booking information
    */
  handleBookAccommodation=(bookingInfo) => booking.create(
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

    /**
   *@description retrives booking details by id
   * @param {number} requestId unique request id
   * @returns {Object} booked accommodation facility details
    */
  getBookedAccommodationByRequestId = (requestId) => (
    booking.findOne({
      where: {
        tripRequestId: requestId
      }
    })
  );
}

export default new AccommodationService();

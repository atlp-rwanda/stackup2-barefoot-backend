import models from '../database/models';
import CrudRepository from '../repository/crudRepo';

const { booking, accommodation, accommodationRoom } = models;

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
        this.associateTable = accommodationRoom;
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
    )
}

export default new AccommodationService();

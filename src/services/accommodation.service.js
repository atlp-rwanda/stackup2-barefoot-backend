import models from '../database/models';
import CrudRepository from '../repository/crudRepo';

const { booking, accommodation, accommodationRoom, request } = models;
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
  handleBookAccommodation = (bookingInfo) => booking.create(
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
   *@description retrieves accommodation details by id
   * @param {Object} id unique accommodation id
   * @returns {Object} accommodation facility details
    */
  getAccommodationById = (id) => accommodation.findOne({
    where: { id }
  });

  /**
  *@description retrieves accommodation details by id
  * @param {Object} id unique accommodation id
  * @returns {Object} accommodation booking details
   */
  getBookingById = (id) => booking.findOne({
    where: { id },
    include: [{ model: accommodation, as: 'accommodation' }, { model: request, as: 'request' }]
  })
}
export default new AccommodationService();

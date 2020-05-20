import models from '../database/models';
import CrudRepository from '../repository/crudRepo';

const { booking, accommodation, accommodationRoom, request } = models;
const { rating } = models;

const {
  accommodationUserReaction,
} = models;

/**
 * @description class AccommodationService handles everything regarding to accommodations
 */
class AccommodationService extends CrudRepository {
  likeAccommodation = { isLike: true, isDislike: false, };

  dislikeAccommodation = { isLike: false, isDislike: true, };

  neutralUserReaction = { isLike: false, isDislike: false, };

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
  *@description retrives accommodation details by id
  * @param {Object} id unique accommodation id
  * @returns {Promise<Object>} accommodation facility details
  */
  getAccommodationById = (id) => accommodation.findOne({ where: { id, } })

  /**
   *@description Saves user reaction towards an accommodation in db 
   * @param {Number} accommodationId db accommodationId
   * @param {Number} userId a user who liked the accommodation
   * @returns {Promise<Object>} liked accommodation details
  */
  handleLikeAccommodation = async (accommodationId, userId) => {
    const {
      getUserAccommodationReaction,
      likeAccommodation,
      neutralUserReaction,
    } = new AccommodationService();
    const reactionInfo = { userId, accommodationId };
    const prevReaction = await getUserAccommodationReaction(reactionInfo);
    if (prevReaction) {
      return accommodationUserReaction
        .update(prevReaction.isLike ? neutralUserReaction : likeAccommodation, {
          where: reactionInfo
        });
    }
    return accommodationUserReaction
      .create({ userId, accommodationId, ...likeAccommodation });
  }

  /**
   *@description Saves user reaction towards an accommodation in db 
   * @param {Number} accommodationId db accommodationId
   * @param {Number} userId a user who liked the accommodation
   * @returns {Promise<Object>} liked accommodation details
  */
  handleDislikeAccommodation = async (accommodationId, userId) => {  
    const {
      getUserAccommodationReaction,
      dislikeAccommodation,
      neutralUserReaction,
    } = new AccommodationService();
    const prevReaction = await getUserAccommodationReaction({ userId, accommodationId });
    if (prevReaction) {
      return accommodationUserReaction
        .update(prevReaction.isDislike ? neutralUserReaction : dislikeAccommodation, {
          where: { userId, accommodationId }
        });
    }
    return accommodationUserReaction
      .create({ userId, accommodationId, ...dislikeAccommodation });
  }

  /**
   *@description gets a specific user accommodation reaction record from db
   * @param {Object} where fields/columns to use in SQL's where clause
   * @returns {Promise<Object>} user accommodation reaction/null
  */
  getUserAccommodationReaction = (where) => accommodationUserReaction.findOne({ where })

  /**
   *@description retrieves number of user likes on a specific accommodation
   * @param {Number} accommodationId a unique accommodation identifier
   * @returns {Promise<Number>} user likes count
  */
  getAccommodationLikes = (accommodationId) => accommodationUserReaction.count({
    where: { accommodationId, isLike: true }
  })

  /**
   *@description retrieves number of user dislikes on a specific accommodation
   * @param {Number} accommodationId a unique accommodation identifier
   * @returns {Promise<Number>} user dislikes count
  */
  getAccommodationDislikes = (accommodationId) => accommodationUserReaction.count({
    where: { accommodationId, isDislike: true }
  })

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

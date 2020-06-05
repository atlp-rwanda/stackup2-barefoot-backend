import { Op } from 'sequelize';
import models from '../database/models';
import tripRequestsStatus from '../utils/tripRequestsStatus.util';
import CrudRepository from '../repository/crudRepo';

const { trips } = models;
const { request, sequelize, Sequelize, user } = models;
const { ACCEPTED, } = tripRequestsStatus;

 /**
   *@description Saves trip request details in database
   * @param {Object} field trip request data
   * @returns {Object} Saved trip request details
    */
const getModel = (field) => {
  let val = request;
  const arr = ['travelFrom', 'travelTo', 'travelDate', 'returnDate'];
  arr.forEach(item => {
    if (field === item) {
      val = trips;
    }
  });
  return val;
};
/**
 * @description Trip requests service
 */
class RequestService extends CrudRepository {
  /**
   * 
   * @constructor
   */
  constructor() {
    super();
    this.model = request;
    this.associateTable = [trips];
  }

  /**
   * @returns {Integer} returns number of traveled places
   * @description returns all of the destinations a and their appearance times from the database
   */
  getMostTraveledDestinations = async () => {
    const placeAndTheirVisitTimes = await sequelize.query('SELECT trips."travelTo", COUNT(*) FROM trips INNER JOIN requests ON requests.id = trips."requestId" WHERE requests.status =\'accepted\' OR requests.status=\'Accepted\' GROUP BY trips."travelTo" ORDER BY count DESC');
    return placeAndTheirVisitTimes;
  }

  /**
   *@description Saves trip request details in database
   * @param {Object} searchCriteria an object of different search options
   * @returns {Object} fields that matches the search keyword 
  */
  handleSearchTripRequests = (searchCriteria) => {
    const { field, search, limit, offset, userId } = searchCriteria;
    const modelz = getModel(field);
    const CUSTOM_QUERY = `SELECT * FROM trips LEFT JOIN requests ON requests.id = trips."requestId" WHERE requests."userId" = ${userId} AND trips."${[field][0]}"`;
    if (['id', 'travelDate', 'returnDate', 'travelType', 'status'].includes(field)) {
      if (userId) {
        return sequelize.query(`${CUSTOM_QUERY} = '${search}' LIMIT ${limit} OFFSET ${offset}`);
      }
      return modelz.findAll({ where: { [field]: { [Op.eq]: search } }, limit, offset, });
    }
    if (userId) {
      return sequelize.query(`${CUSTOM_QUERY} LIKE '%${search}%' LIMIT ${limit} OFFSET ${offset}`);
    }
    return modelz.findAll({ where: { [field]: { [Op.iLike]: `%${search}%` } }, limit, offset, });
  }

  /**
  *@description Retrieves trips stats from database
  * @param {Number} userId current user's database id
  * @param {Date} startDate start date for stats
  * @param {Date} endDate end date for stats
  * @returns {Object} trips stats
   */
  getTripsStats = (userId, startDate, endDate) => {
    return request.count({
      where: {
        userId,
        status: ACCEPTED,
      },
      include: [{
        model: trips,
        required: true,
        where: {
          travelDate: {
            [Op.between]: [startDate, endDate]
          },
        }
      }]
    });
  }

  /**
   * @description Used by a manager to approve or reject a trip request
   * @param {number} id Trip request id
   * @param {string} status Approval status: accepted
   * @param {number} handledBy Manager id
   * @returns {object} returns a trip request with changed status
   */
   updateTripRequestStatus = async (id, status, handledBy) => {
    const updatedRequest = await request.update(
      {
        status,
        handledBy
      },
      {
        where: { id }
      }
    );
    return updatedRequest;
  }

  /**
   * @description Used by a manager to assign a trip request to another manager
   * @param {number} requestId Trip request id
   * @param {number} newManagerId New manager id
   * @returns {object} returns a trip request with changed handler
   */
   reassignTripRequest = async (requestId, newManagerId) => {
    const id = requestId;
    const handledBy = newManagerId;
    const updateHandler = await request.update(
      {
        handledBy
      },
      {
        where: { id }
      }
    );
    return updateHandler;
  }

  /**
   *@description Saves trip request details in database
   * @param {string} id of a trip
   * @returns {Object} all pending requests
    */
  findTrip = (id) => {
    return request.findOne({
      where: { id }
    });
  }
  
  /**
   * @param {string} id
   * @param {boolean} status
   * @returns {Object} change inAppNotification to false
    */
  updateInAppNotification = async (id, status) => {
    const update = await user.update(
      { inAppNotification: !status },
      { where: { id } }
    );
    return update;
  }
}
export default new RequestService();

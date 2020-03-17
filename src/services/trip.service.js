import models from '../database/models';
import CrudRepository from '../repository/crudRepo';

const { trips } = models;

/**
 * @description Trip service
 */
 class TripService extends CrudRepository {
  /**
   * 
   * @constructor
   */
  constructor() {
    super();
    this.model = trips;
  }
}

export default new TripService();

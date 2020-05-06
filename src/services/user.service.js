import models from '../database/models';
import CrudRepository from '../repository/crudRepo';

const { user } = models;

/**
 * @description Class to handle users
 */
class UserService extends CrudRepository {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.model = user;
  }
}

export default new UserService();

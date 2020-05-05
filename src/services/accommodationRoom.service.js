import CrudRepository from '../repository/crudRepo';
import models from '../database/models';

const { accommodationRoom } = models;
/**
 * @class
 * @classdesc it inherits all of methods of CrudRepository
 */
class AccommodationRoomService extends CrudRepository {
/**
 * @constructor
 */
    constructor() {
        super();
        this.model = accommodationRoom;
    }
}

export default new AccommodationRoomService();

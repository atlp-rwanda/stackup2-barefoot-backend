import models from '../database/models';
import CrudRepository from '../repository/crudRepo';

const { booking } = models;

/**
 * @description class BookAccommodationService handles everything regarding to accommodations
 */
class BookAccommodationService extends CrudRepository {
    /**
     * @constructor
     */
    constructor() {
        super();
        this.model = booking;
    }
}

export default new BookAccommodationService();

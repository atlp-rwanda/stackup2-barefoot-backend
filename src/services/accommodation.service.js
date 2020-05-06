import models from '../database/models';
import CrudRepository from '../repository/crudRepo';

const { accommodation, accommodationRoom, rating } = models;

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
}

export default new AccommodationService();

import models from '../database/models';
import CrudRepository from '../repository/crudRepo';

const { accommodation, accommodationRoom } = models;

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
        this.associateTable = [accommodationRoom];
    }
}

export default new AccommodationService();

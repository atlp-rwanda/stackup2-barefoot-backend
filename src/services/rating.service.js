import models from '../database/models';
import CrudRepository from '../repository/crudRepo';

const { rating } = models;

/**
 * @description class AccommodationService handles everything regarding to accommodations
 */
class RatingService extends CrudRepository {
    /**
     * @constructor
     */
    constructor() {
        super();
        this.model = rating;
    }
}

export default new RatingService();

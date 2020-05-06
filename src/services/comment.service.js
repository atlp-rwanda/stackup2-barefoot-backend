import models from '../database/models';
import CrudRepository from '../repository/crudRepo';

const { comment } = models;

/**
 * @description class CommentService handles everything regarding to comments
 */
class CommentService extends CrudRepository {
    /**
     * @constructor
     */
        constructor() {
            super(); 
            this.model = comment;
        }

    /**
     * @param {object} commentOptions
     * @returns {Object} d
     * @description it returns all of the comments of a specific request
     */
        getAllCommentOfSpecificReq = async (commentOptions) => {
        const { requestId, offset, limit } = commentOptions;
        const { count, rows } = await 
            this.getAndCountAllIncludeAssociation({ requestId }, offset, limit);
        const foundComments = rows.map((cmt) => cmt.get({ plain: true }));
        return { count, foundComments };
    }
}

export default new CommentService();

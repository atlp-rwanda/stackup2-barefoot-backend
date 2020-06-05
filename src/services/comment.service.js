import models from '../database/models';
import CrudRepository from '../repository/crudRepo';

const {
    comment
} = models;

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
     * @param {object} newCommentData
     * @returns {object} savedComment
     * @description this function saveNewComment saves a comment in database
     */
    saveNewComment = async (newCommentData) => {
        const newSavedComment = await comment.create(newCommentData);
        return newSavedComment;
    }

    /**
     * @param {object} commentOptions
     * @returns {Object} d
     * @description it returns all of the comments of a specific request
     */
    getAllCommentOfSpecificReq = async (commentOptions) => {
        const {
            requestId,
            offset,
            limit
        } = commentOptions;
        const {
            count,
            rows
        } = await
        this.getAndCountAllIncludeAssociation({
            requestId
        }, offset, limit);
        const foundComments = rows.map((cmt) => cmt.get({
            plain: true
        }));
        return {
            count,
            foundComments
        };
    }

    /**
     * @param {object} commentData
     * @returns {object} updatedComment
     * @description it returns the updated comment
     */
    updateComment = async (commentData) => {
        const {
            id
        } = commentData;
        const updComment = await comment.update(commentData, {
            where: {
                id
            },
            returning: true
        });
        return updComment;
    }
}

export default new CommentService();

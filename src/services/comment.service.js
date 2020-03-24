import models from '../database/models';

const { comment } = models;

/**
 * @description class CommentService handles everything regarding to comments
 */
export default class CommentService {
    /**
     * @param {object} newCommentData
     * @returns {object} savedComment
     * @description this function saveNewComment saves a comment in database
     */
    static saveNewComment = async (newCommentData) => {
        const newSavedComment = await comment.create(newCommentData);
        return newSavedComment;
    }

    /**
     * @param {object} commentOptions
     * @returns {Object} d
     * @description it returns all of the comments of a specific request
     */
    static getAllCommentOfSpecificReq = async (commentOptions) => {
        const { requestId, offset, limit } = commentOptions;
        const { count, rows } = await comment
            .findAndCountAll({ where: { requestId }, offset, limit, order: [['createdAt', 'DESC']] });
        const foundComments = rows.map((cmt) => cmt.get({ plain: true }));
        return { count, foundComments };
    }

    /**
     * @param {object} commentData
     * @returns {object} updatedComment
     * @description it returns the updated comment
     */
    static updateComment = async (commentData) => {
        const { id } = commentData;
        const updComment = await comment.update(commentData, { where: { id }, returning: true });
        return updComment;
    }

    /**
     * @param {Integer} id
     * @returns {object} deletedComment
     * @description it returns the deleted comment
     */
    static deleteComment = async (id) => {
        const dltComment = await comment.destroy({ where: { id } });
        return dltComment;
    }

    /**
     * @param {Integer} id
     * @returns {object} foundComment
     * @description it returns a found comment from db
     */
    static getCommentByPk = async (id) => {
        const foundComment = await comment.findByPk(id);
        return foundComment;
    }
}

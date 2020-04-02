import express from 'express';
import RequestController from '../../controllers/request.controller';
import Authentication from '../../middlewares/authentication';
import controllers from '../../controllers';
import {
    validateCommentPost,
    validateCommentUpdate,
    validateCommentDelete,
    validateCommentRetrieval, validateReqRetrieve } from '../../utils/comment.validations';
import {
    isTripRequestValid,
    isTripRequestsSearchValid,
} from '../../utils/validations';
    
const { createTripRequest, placesAndVisitTimes, getListOfMyRequests } = RequestController;

const {
    searchTripRequests,
    getUserTripsStats,
} = RequestController;
const {
    isUserLoggedInAndVerified
} = Authentication;

const router = express.Router();
const {
    addNewComment,
    getCommentSpecificReq,
    updateComments,
    deleteComment
} = controllers.CommentController;

router.post('/', [isUserLoggedInAndVerified, isTripRequestValid], createTripRequest);
router.get('/most-traveled-destinations', isUserLoggedInAndVerified, placesAndVisitTimes);
router.post('/:requestId/comment', isUserLoggedInAndVerified, validateCommentPost, addNewComment);
router.get('/comment', isUserLoggedInAndVerified, validateCommentRetrieval, getCommentSpecificReq);
router.patch('/comment/:commentId', isUserLoggedInAndVerified, validateCommentUpdate, updateComments);
router.delete('/comment/:commentId', isUserLoggedInAndVerified, validateCommentDelete, deleteComment);
router.get('/', isUserLoggedInAndVerified, validateReqRetrieve, getListOfMyRequests);
router.get('/search', [isUserLoggedInAndVerified, isTripRequestsSearchValid], searchTripRequests);
router.get('/stats', [isUserLoggedInAndVerified], getUserTripsStats);

export default router;

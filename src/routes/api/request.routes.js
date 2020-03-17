import express from 'express';
import RequestController from '../../controllers/request.controller';
import Authentication from '../../middlewares/authentication';
import requestCheck from '../../middlewares/requestChecker';
import controllers from '../../controllers';
import {
  validateCommentPost,
  validateCommentUpdate,
  validateCommentDelete,
  validateCommentRetrieval, validateReqRetrieve
} from '../../utils/comment.validations';
import {
  isTripRequestValid,
  isTripRequestsSearchValid,
  handleRequestStatusUpdate,
  handleRequestReassignment,
} from '../../utils/validations';

const {
  createTripRequest,
  placesAndVisitTimes,
  getListOfMyRequests,
  updateTripRequest,
  searchTripRequests,
  getUserTripsStats,
  getListOfAllRequests
} = RequestController;
const {
  isUserLoggedInAndVerified,
  isUserManager,
  isUserSuperAdmin
} = Authentication;
const {
  isRequestOpenIsRequestYours,
  isRequestValid,
  checkTripRequest,
  isNewUserAManager,
  checkRequesterManager
} = requestCheck;
const {
  addNewComment,
  getCommentSpecificReq,
  updateComments,
  deleteComment
} = controllers.CommentController;

const router = express.Router();

router.post('/', [isUserLoggedInAndVerified, isTripRequestValid], createTripRequest);
router.get('/most-traveled-destinations', isUserLoggedInAndVerified, placesAndVisitTimes);
router.post('/:requestId/comment', isUserLoggedInAndVerified, validateCommentPost, addNewComment);
router.get('/comment', isUserLoggedInAndVerified, validateCommentRetrieval, getCommentSpecificReq);
router.patch('/comment/:commentId', isUserLoggedInAndVerified, validateCommentUpdate, updateComments);
router.delete('/comment/:commentId', isUserLoggedInAndVerified, validateCommentDelete, deleteComment);
router.get('/', isUserLoggedInAndVerified, validateReqRetrieve, getListOfMyRequests);
router.get('/requests', isUserLoggedInAndVerified, isUserSuperAdmin, validateReqRetrieve, getListOfAllRequests);
router.get('/search', [isUserLoggedInAndVerified, isTripRequestsSearchValid], searchTripRequests);
router.get('/stats', [isUserLoggedInAndVerified], getUserTripsStats);
router.patch('/:requestId', isUserLoggedInAndVerified, isRequestValid, isRequestOpenIsRequestYours, isTripRequestValid, updateTripRequest);
router.patch(
  '/:tripRequestId/approve',
  isUserLoggedInAndVerified,
  isUserManager,
  handleRequestStatusUpdate,
  checkTripRequest,
  checkRequesterManager,
  RequestController.approveTripRequest
);
router.patch(
  '/:tripRequestId/reject',
  isUserLoggedInAndVerified,
  isUserManager,
  handleRequestStatusUpdate,
  checkTripRequest,
  checkRequesterManager,
  RequestController.rejectTripRequest
);
router.patch(
  '/:tripRequestId/reassign',
  isUserLoggedInAndVerified,
  isUserManager,
  handleRequestReassignment,
  checkTripRequest,
  isNewUserAManager,
  checkRequesterManager,
  RequestController.assignTripRequest
);

export default router;

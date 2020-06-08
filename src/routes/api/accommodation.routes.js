import Authentication from '../../middlewares/authentication';
import controllers from '../../controllers';
import {
    validateAccommodation,
    validateAccommodationRoom,
    validateAccommodationId,
    validateUpdateRoom,
    validateDeleteAccommodation
} from '../../middlewares/accommodationValidations';
import accommodationMiddleware from '../../middlewares/ratingChecker';
import {
    checkAccommodationBookingInfo,
} from '../../utils/validations';
import UserAccommodationReaction from '../../middlewares/userAccommodationReaction';

import {
    validateRatingInfo,
} from '../../utils/otherValidations';

const {
    AccommodationController,
} = controllers;

const {
    updateAccommodation,
    updateAccommodationRoom,
    deleteAccommodation,
    deleteAccommodationRoom,
    rateAccommodation,
    getBookedAccommodation,
    likeAccommodation,
    dislikeAccommodation,
} = AccommodationController;

const {
    bookAccommodation,
    addNewAccommodation,
    addNewAccommodationRoom,
    getAccommodations
} = AccommodationController;
const {
    isUserLoggedInAndVerified
} = Authentication;
const {
    didRequestBookAccommodation,
    isTripRequestValidIsYours,
    rateTheAccommodation, 
} = accommodationMiddleware;
const {
    checkAccommodationInfo,
} = UserAccommodationReaction;

const router = require('express').Router();

router.post('/book', [isUserLoggedInAndVerified, checkAccommodationBookingInfo], bookAccommodation);
router.post('/', isUserLoggedInAndVerified, validateAccommodation, addNewAccommodation);
router.post('/:accommodationId/rooms', isUserLoggedInAndVerified, validateAccommodationRoom, addNewAccommodationRoom);
router.get('/', isUserLoggedInAndVerified, getAccommodations);
router.patch('/:id', isUserLoggedInAndVerified, validateAccommodationId, validateAccommodation, updateAccommodation);
router.patch('/rooms/:id', isUserLoggedInAndVerified, validateUpdateRoom, updateAccommodationRoom);
router.delete('/:id', isUserLoggedInAndVerified, validateAccommodationId, validateDeleteAccommodation, deleteAccommodation);
router.delete('/rooms/:id', isUserLoggedInAndVerified, deleteAccommodationRoom);
router.post(
    '/rates', 
    isUserLoggedInAndVerified, 
    validateRatingInfo, 
    isTripRequestValidIsYours, 
    didRequestBookAccommodation, 
    rateTheAccommodation,
    rateAccommodation
);
router.get('/:accommodationId', getBookedAccommodation);
router.post('/:id/like', [
    isUserLoggedInAndVerified,
    checkAccommodationInfo,
], likeAccommodation);
router.post('/:id/dislike', [
    isUserLoggedInAndVerified,
    checkAccommodationInfo,
], dislikeAccommodation);

export default router;

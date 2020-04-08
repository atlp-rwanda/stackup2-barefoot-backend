import Authentication from '../../middlewares/authentication';
import controllers from '../../controllers';
import {
    validateAccommodation,
    validateAccommodationRoom,
    validateAccommodationId,
    validateUpdateRoom,
    validateDeleteAccommodation
} from '../../middlewares/accommodationValidations';

import {
    checkAccommodationBookingInfo,
} from '../../utils/validations';

const {
    AccommodationController,
} = controllers;

const {
    bookAccommodation,
    addNewAccommodation,
    addNewAccommodationRoom,
    getAccommodations,
    updateAccommodation,
    updateAccommodationRoom,
    deleteAccommodation,
    deleteAccommodationRoom
} = AccommodationController;

const {
    isUserLoggedInAndVerified
} = Authentication;

const router = require('express').Router();

router.post('/book', [isUserLoggedInAndVerified, checkAccommodationBookingInfo], bookAccommodation);
router.post('/', isUserLoggedInAndVerified, validateAccommodation, addNewAccommodation);
router.post('/:accommodationId/rooms', isUserLoggedInAndVerified, validateAccommodationRoom, addNewAccommodationRoom);
router.get('/', isUserLoggedInAndVerified, getAccommodations);
router.patch('/:id', isUserLoggedInAndVerified, validateAccommodationId, validateAccommodation, updateAccommodation);
router.patch('/rooms/:id', isUserLoggedInAndVerified, validateUpdateRoom, updateAccommodationRoom);
router.delete('/:id', isUserLoggedInAndVerified, validateAccommodationId, validateDeleteAccommodation, deleteAccommodation);
router.delete('/rooms/:id', isUserLoggedInAndVerified, deleteAccommodationRoom);

export default router;

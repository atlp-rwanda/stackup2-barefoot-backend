import express from 'express';
import Authentication from '../../middlewares/authentication';
import controllers from '../../controllers';

import {
    checkAccommodationBookingInfo,
} from '../../utils/validations';

const {
    AccommodationController,
} = controllers;

const {
    bookAccommodation,
} = AccommodationController;

const {
    isUserLoggedInAndVerified
} = Authentication;

const router = require('express').Router();

router.post('/book', [isUserLoggedInAndVerified, checkAccommodationBookingInfo], bookAccommodation);

export default router;

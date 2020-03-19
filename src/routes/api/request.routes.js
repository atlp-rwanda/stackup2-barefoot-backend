import express from 'express';
import RequestController from '../../controllers/request.controller';
import Authentication from '../../middlewares/authentication';
import { validateTripRequest } from '../../middlewares/validations';

const { createTripRequest } = RequestController;
const {
    isCurrentUserLoggedIn,
    isCurrentUserVerified,
} = Authentication;

const router = express.Router();

router.post('/', [isCurrentUserLoggedIn, isCurrentUserVerified, validateTripRequest], createTripRequest);

export default router;

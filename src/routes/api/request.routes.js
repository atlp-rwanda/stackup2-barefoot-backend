import express from 'express';
import RequestController from '../../controllers/request.controller';
import Authentication from '../../middlewares/authentication';
import { validateTripRequest } from '../../utils/validations';

const { createTripRequest, placesAndVisitTimes, getTripsStats } = RequestController;
const {
    isUserLoggedInAndVerified
} = Authentication;

const router = express.Router();

router.post('/', [isUserLoggedInAndVerified, validateTripRequest], createTripRequest);
router.get('/most-traveled-destinations', isUserLoggedInAndVerified, placesAndVisitTimes);
router.get('/stats', [isUserLoggedInAndVerified], getTripsStats);

export default router;

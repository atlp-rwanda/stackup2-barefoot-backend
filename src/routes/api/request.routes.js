import express from 'express';
import RequestController from '../../controllers/request.controller';
import Authentication from '../../middlewares/authentication';
import { validateTripRequest } from '../../utils/validations';

const { createTripRequest, placesAndVisitTimes, pendingTripRequests, getTrip } = RequestController;
const {
    isUserLoggedInAndVerified
} = Authentication;

const router = express.Router();

router.post('/', [isUserLoggedInAndVerified, validateTripRequest], createTripRequest);
router.get('/most-traveled-destinations', isUserLoggedInAndVerified, placesAndVisitTimes);
router.get('/inapp/notification/', isUserLoggedInAndVerified, pendingTripRequests);
router.get('/:id', getTrip);

export default router;

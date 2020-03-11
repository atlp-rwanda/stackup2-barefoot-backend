import express from 'express';
import controllers from '../../controllers';
import { isUserVerified } from '../../middlewares/profileDataChecker';
import { authorizeAccess } from '../../middlewares/authValidation';

const profileRouter = express.Router();
const { displayUserProfile } = controllers.ProfileController;

profileRouter.get('/read-profile/:requestedProfile', authorizeAccess, isUserVerified, displayUserProfile);

export default profileRouter;

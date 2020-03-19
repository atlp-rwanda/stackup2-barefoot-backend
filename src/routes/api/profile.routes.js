import express from 'express';
import controllers from '../../controllers';
import { profileReqCheckpoint, validatProfilUpdate } from '../../middlewares/profileDataChecker';
import { authorizeAccess, signupValidation } from '../../middlewares/authValidation';

const profileRouter = express.Router();
const { displayUserProfile, updateUserProfile, changeUserPassword } = controllers.ProfileController;

profileRouter.get('/:requestedProfile', authorizeAccess, profileReqCheckpoint, displayUserProfile);
profileRouter.get('/', authorizeAccess, profileReqCheckpoint, displayUserProfile);
profileRouter.patch('/', authorizeAccess, validatProfilUpdate, profileReqCheckpoint, signupValidation, updateUserProfile);
profileRouter.patch('/password', authorizeAccess, validatProfilUpdate, profileReqCheckpoint, changeUserPassword);

export default profileRouter;

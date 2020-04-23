import express from 'express';
import controllers from '../../controllers';
import { profileReqCheckpoint, validatProfilUpdate } from '../../middlewares/profileDataChecker';
import { signupValidation, passwordValidation } from '../../middlewares/authValidation';
import Authentication from '../../middlewares/authentication';

const profileRouter = express.Router();
const {
  displayUserProfile,
  updateUserProfile,
  changeUserPassword
} = controllers.ProfileController;
const {
  isUserLoggedInAndVerified
} = Authentication;

profileRouter.get('/:requestedProfile', isUserLoggedInAndVerified, profileReqCheckpoint, displayUserProfile);
profileRouter.get('/', isUserLoggedInAndVerified, profileReqCheckpoint, displayUserProfile);
profileRouter.patch('/', isUserLoggedInAndVerified, validatProfilUpdate, profileReqCheckpoint, signupValidation, updateUserProfile);
profileRouter.patch('/password', isUserLoggedInAndVerified, profileReqCheckpoint, passwordValidation, changeUserPassword);

export default profileRouter;

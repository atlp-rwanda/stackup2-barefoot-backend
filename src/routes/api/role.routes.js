import express from 'express';
import RoleController from '../../controllers/role.controller';
import Authentication from '../../middlewares/authentication';
import { roleValidation } from '../../middlewares/roleValidations';

const { assignRole } = RoleController;
const {
    isUserLoggedInAndVerified,
    isUserSuperAdmin,
} = Authentication;

const roleRoutes = express.Router();

roleRoutes.patch('/assign-role', isUserLoggedInAndVerified, isUserSuperAdmin, roleValidation, assignRole);

export default roleRoutes;

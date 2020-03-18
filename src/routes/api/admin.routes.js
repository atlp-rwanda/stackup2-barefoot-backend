import express from 'express';
import adminController from '../../controllers/admin.controller';
import validate from '../../middlewares/appValidation';
import { validateRoleAssigning } from '../../middlewares/validations';

const adminRoutes = express.Router();
const { assignRole } = adminController;

adminRoutes.patch('/assignrole', async (req, res, next) => {
    await validate(req, res, next, validateRoleAssigning);
}, assignRole);

export default adminRoutes;

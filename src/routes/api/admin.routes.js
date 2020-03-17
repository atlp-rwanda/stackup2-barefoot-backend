import express from 'express';
import adminController from '../../controllers/admin.controller';
import adminValidation from '../../middlewares/adminValidation';

const adminRoutes = express.Router();
const { assignRole } = adminController;
const { roleSettingValidation } = adminValidation;

adminRoutes.patch('/assignrole', roleSettingValidation, assignRole);

export default adminRoutes;

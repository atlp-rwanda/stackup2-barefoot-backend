import jwtDecode from 'jwt-decode';
import responseHandlers from '../utils/responseHandlers';
import statusCodes from '../utils/statusCodes';
import customMessages from '../utils/customMessages';
import adminService from '../services/admin.service';
import userService from '../services/authentication.service';
import sendEmail from '../services/sendEmail.service';

const { successResponse, errorResponse } = responseHandlers;
const { updateRole } = adminService;
const { findUserByEmail } = userService;

/**
 * @description User Admin controller
 */
export default class AdminController {
    /**
     * @param {object} req request object
     * @param {object} res response object
     * @returns {object} response json object
     * @description user role settings function
     */
    static async assignRole(req, res) {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwtDecode(token);
        console.log(decoded.role);
        if (!(decoded.role === 'superAdmin')) {
            return errorResponse(res, statusCodes.unAuthorized, customMessages.userNotAuthorized);
        }

        const { email, role } = req.body;
        
        const userExists = await findUserByEmail(email.toLowerCase());
        if (userExists) {
            await updateRole(email, role);
            await sendEmail.userRoleSettings(email, `${process.env.APP_URL}/dashboard`, userExists.firstName);
            return successResponse(res, statusCodes.ok, customMessages.assignRoleMessage);
        }
        return errorResponse(res, statusCodes.forbidden, customMessages.notExistUser);
    }
}

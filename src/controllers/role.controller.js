import responseHandlers from '../utils/responseHandlers';
import statusCodes from '../utils/statusCodes';
import customMessages from '../utils/customMessages';
import roles from '../services/role.service';
import authentication from '../services/authentication.service';
import userRoles from '../utils/userRoles.utils';

const { assignRole } = roles;
const { findUserByEmailOrUsername } = authentication;
const { notExistUser, roleAssigned, existingRole, superUser } = customMessages;
const { forbidden, ok } = statusCodes;
const { SUPER_USER } = userRoles;

/**
   * @description user role controller class
   */
export default class UserRoleController {
      /**
   * @param {Request} req Node/express request
   * @param {Response} res Node/express response
   * @returns {Object} Custom response depending on function's inputs
   * @description update user role
   */
    static assignRole = async (req, res) => {
        const { email, role } = req.body;
        const userExists = await findUserByEmailOrUsername(email);
        if (!userExists) {
            return responseHandlers.errorResponse(res, forbidden, notExistUser);
        }
        if (userExists.dataValues.role === role) {
            return responseHandlers.errorResponse(res, statusCodes.badRequest, existingRole);
        }
        if (userExists.dataValues.role === SUPER_USER) {
            return responseHandlers.errorResponse(res, statusCodes.badRequest, superUser);
        }
        await assignRole(req.body);
        return responseHandlers.successResponse(res, ok, roleAssigned);
    };
}

import models from '../database/models';

const { user } = models;

/**
 * @description Class to handle user admin
 */
export default class UserAdmin {
    /**
    * @param email
    * @returns {object} The Object of messages
    */
    
    static updateRole = async (email, role) => {
        const assignRoles = await user.update(
            { role },
            { where: { email } }
        );
        return assignRoles;
    };
}

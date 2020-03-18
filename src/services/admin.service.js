import models from '../database/models';
import updateFunction from './updateFunction.service';

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
        await updateFunction(email, role);
    };
}

import models from '../database/models';

const { user } = models;

/**
 * @description assigning user role service
 */
export default class userRole {
      /**
   *@description update user role in database
   * @param {Object} newObject user role data
   * @returns {Object} Saved user role details
    */
    static assignRole = async (newObject) => {
        const assignRole = await user.update(
            { role: newObject.role }, 
            { where: { email: newObject.email } }
);
        return assignRole;
    }
}

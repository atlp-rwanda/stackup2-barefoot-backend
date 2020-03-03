import { v4 as uuidv4 } from 'uuid';

/** Returns a username that is unique in db
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string} username
 * @description Returns a username that is unique in db
 */
const generateUniqueUsername = (firstName, lastName) => {
        const newUsername = `${firstName}-${lastName}-${uuidv4()}`;
        return newUsername;
};
export default generateUniqueUsername;

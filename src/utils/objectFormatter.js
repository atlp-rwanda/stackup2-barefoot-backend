import generateUniqueUsername from './usernameGenerator.utils';
/**
 * @param {object} data
 * @param {string} provider
 * @returns {object} response
 * @description Returns an object to create an instanace in db
 */
const fbObjectFormatter = (data, provider) => {
  const newUser = {};
  const {
    id, first_name: firstName, last_name: lastName, email
  } = data;
  newUser.firstName = firstName;
  newUser.lastName = lastName;
  newUser.username = generateUniqueUsername(firstName, lastName);
  newUser.socialMediaId = id;
  newUser.email = email;
  newUser.provider = provider;
  newUser.isVerified = true;
  return newUser;
};
/**
 * @param {object} data
 * @param {string} provider
 * @param {string} id
 * @returns {object} response
 * @description Returns an object to create an instanace in db
 */
const googleObjectFormatter = (data, provider, id) => {
  const { given_name: givenName, family_name: familyName, email } = data;
  const newUser = {};
  newUser.firstName = givenName;
  newUser.lastName = familyName;
  newUser.username = email;
  newUser.email = email;
  newUser.socialMediaId = id;
  newUser.provider = provider;
  newUser.isVerified = true;
  return newUser;
};
export default { fbObjectFormatter, googleObjectFormatter };

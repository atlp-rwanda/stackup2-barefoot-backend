/**
 * @param {object} data
 * @param {string} provider
 * @returns {object} response
 * @description Returns an object to create an instanace in db
 */
const fbObjectFormatter = (data, provider) => {
  const newUser = {};
  const {
    id, first_name, last_name, email
  } = data;
  newUser.firstName = first_name;
  newUser.lastName = last_name;
  newUser.social_media_id = id;
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
  const { given_name, family_name, email } = data;
  const newUser = {};
  newUser.firstName = given_name;
  newUser.lastName = family_name;
  newUser.email = email;
  newUser.social_media_id = id;
  newUser.provider = provider;
  newUser.isVerified = true;
  return newUser;
};
export default { fbObjectFormatter, googleObjectFormatter };

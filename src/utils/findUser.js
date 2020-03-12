import models from '../database/models';

/**
   * function findAll() returns all users in db
   * @param {string} identifier
   * @returns {object} returns a user with the email in params
   */
const findUser = async (identifier) => {
  let email;
  let social_media_id;
  if (identifier.includes('@')) {
    email = identifier;
  } else {
    social_media_id = identifier;
  }
  const { user } = models;
  const currUser = await user.findOne(email ? {
    where: { email }
  } : { where: { social_media_id } });

  return currUser;
};
export default findUser;

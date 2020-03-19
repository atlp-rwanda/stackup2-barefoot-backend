import models from '../database/models';

/**
   * function findOne() returns a user in db
   * @param {string} identifier
   * @returns {object} returns a user with the email in params
   */
const findUser = async (identifier) => {
  let email;
  let socialMediaId;
  if (identifier.includes('@')) {
    email = identifier;
  } else {
    socialMediaId = identifier;
  }
  const { user } = models;
  const currUser = await user.findOne(email ? {
    where: { email }
  } : { where: { socialMediaId } });

  return currUser;
};
export default findUser;

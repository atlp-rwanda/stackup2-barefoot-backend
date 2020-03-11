import models from '../database/models';

const { user } = models;

/**
 * @description class ProfileService handles everything regarding to profile
 */
export default class ProfileService {
  /**
   * @param{object} profileData
   * @param{string} email
   * @returns{object} newProfileData
   * @description this function updateProfile() and returns new updated profile data
   */
  static updateProfile = async (profileData, email) => {
    const updatedUser = await user.update(profileData, { where: { email }, returning: true });
    return updatedUser[1][0];
  }

  /**
   * @param{string} newPassword
   * @param{string} email
   * @returns{string} new password
   * @description this function changePassword() changes the password from the database
   */
  static changePassword = async (newPassword, email) => {
    await user.update({ password: newPassword }, { where: { email } });
  }
}

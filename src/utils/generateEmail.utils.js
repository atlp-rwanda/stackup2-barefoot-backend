/**
   * @param {object} email request object
   * @returns {object} response json object
   * @description replace null email with a string
   */
const generatEmail = email => {
    if (!email) {
        email = 'Empty Email';
        return email;
    } else {
        return email;
    }
};
export default generatEmail;

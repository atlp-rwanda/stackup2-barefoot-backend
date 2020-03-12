import responseHandlers from '../utils/responseHandlers';
import statusCode from '../utils/statusCodes';
import messages from '../utils/customMessages';
import objectFormatter from '../utils/objectFormatter';
import passportResponse from '../utils/passportResponse';

const {
  fbObjectFormatter,
  googleObjectFormatter
} = objectFormatter;
const {
  successResponse,
  errorResponse
} = responseHandlers;

/**
   * @description Login using google and facebook
   */
class AuthController {
  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} sends response to the user
   * @description sends the response of successful login
   */
  static async facebookLogin(req, res) {
    const User = req.user;
    const { provider } = User;
    const user = fbObjectFormatter(User._json, provider);
    const token = await passportResponse(user);
    return successResponse(
      res,
      statusCode.ok,
      messages.socialMediaAuthSucess,
      token
    );
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} sends response to the user
   * @description sends the response of successful login
   */
  static async googleLogin(req, res) {
    const User = req.user;
    const { id, provider } = User;
    const user = googleObjectFormatter(User._json, provider, id);
    const token = await passportResponse(user);
    return successResponse(
      res,
      statusCode.ok, messages.socialMediaAuthSucess,
      token
    );
  }
}
export default AuthController;

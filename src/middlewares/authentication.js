import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import customMessages from '../utils/customMessages';
import statusCodes from '../utils/statusCodes';
import UserService from '../services/authentication.service';
import responseHandlers from '../utils/responseHandlers';

const { errorResponse } = responseHandlers;
const { unAuthorized } = statusCodes;
const {
  tokenAbsent,
  tokenVerifyFailed,
  accountNotVerified,
} = customMessages;

/**
   * @description Verifies authenticity of current user
   */
export default class Authentication {
  /**
   * @param {Request} req Node/Express Request object
   * @param {Response} res Node/Express Response object
   * @param {NextFunction} next Node/Express Next callback function
   * @returns {NextFunction | Object} Node/Express Next callback function or an error response
   * @description Checks existence of a token in the Authorization request header,
   * decodes it, and finaly adds the decoded data
   * to Node/Express's Request Object as sessionUser property
   */
  static async isCurrentUserLoggedIn(req, res, next) {
    let token = req.get('authorization');
    if (!token) {
        return errorResponse(res, unAuthorized, tokenAbsent);
    }
    token = token.split(' ').pop();
    return verify(token, process.env.JWT_KEY, async (verifyError, decodedToken) => {      
      if (verifyError || !(await UserService.findUserByEmailOrUsername(decodedToken.email))) {
        return errorResponse(res, unAuthorized, tokenVerifyFailed);
      }
      req.sessionUser = decodedToken;
      return next();
    });
  }

  /**
   * @param {Request} req Node/Express Request object
   * @param {Response} res Node/Express Response object
   * @param {NextFunction} next Node/Express Next callback function
   * @returns {NextFunction | Object} Node/Express Next callback function or an error response
   * @description Checks if the current user account is verified.
   * To use this method, you must call "isUserLoggedIn" 
   * method in "Authentication" middleware class first
   */
  static async isCurrentUserVerified(req, res, next) {
    const user = await UserService.findUserByEmailOrUsername(req.sessionUser.email);
    if (!user.isVerified) {
      return errorResponse(res, unAuthorized, accountNotVerified);
    }
    return next();
  }
}

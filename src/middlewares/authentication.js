import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import customMessages from '../utils/customMessages';
import statusCodes from '../utils/statusCodes';
import UserService from '../services/authentication.service';
import responseHandlers from '../utils/responseHandlers';
import redisClient from '../database/redis.config';

const { errorResponse } = responseHandlers;
const { unAuthorized, badRequest } = statusCodes;
const {
  tokenVerifyFailed,
  accountNotVerified,
  tokenInvalid,
  tokenMissing
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
   * @description Checks presence of a token in the Authorization request header,
   * decodes it, checks if token is blacklisted, 
   * checks if user is verified then adds the decoded data
   * to the request object as sessionUser property
   */
  static async isUserLoggedInAndVerified(req, res, next) {
    let token = req.get('authorization');
    if (!token) {
      return errorResponse(res, badRequest, tokenMissing);
    }
    token = token.split(' ').pop();
    try {
      const decodedToken = verify(token, process.env.JWT_KEY);
      const user = await UserService.findUserByEmailOrUsername(decodedToken.email);
      return redisClient.smembers('token', (err, userToken) => {
        if (userToken.includes(token) || !user) {
          return errorResponse(res, unAuthorized, tokenVerifyFailed);
        }
        if (!user.isVerified) {
          return errorResponse(res, unAuthorized, accountNotVerified);
        }
        req.sessionUser = decodedToken;
        return next();
      });
    } catch (error) {
      return errorResponse(res, badRequest, tokenInvalid);
    }
  }
}

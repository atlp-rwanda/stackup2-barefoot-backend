import jwt from 'jsonwebtoken';
import moment from 'moment';
import redisClient from '../database/redis.config';

/**
 * @description Class to handle background and scheduled tasks
 */
export default class BackgroundTasks {
  /**
   *@description Removes expired tokens from the database
   * @returns {null} null
  */
  static expiredTokenCleanUp = async () => {
    redisClient.smembers('token', (err, userToken) => {
      userToken.forEach((token) => {
        const decodedToken = jwt.verify(
          token,
          process.env.JWT_KEY,
          {
            ignoreExpiration: true
          }
        );
        const { exp } = decodedToken;
        if (moment(exp, 'X').format('x') < moment().format('x')) {
          redisClient.srem('token', token);
        }
      });
    });
  };
}

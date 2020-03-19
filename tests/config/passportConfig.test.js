import chai from 'chai';
import { facebookCallBack, googleCallBack } from '../../src/config/passport';

const { expect } = chai;
/**
   * @param {object} error
   * @param {object} data
   * @returns {object} response json object
   */
const callBackFunc = (error, data) => data;
const user = { msg: 'hello' };

describe('Passport Config', () => {
  it('shoudl test Facebook passport', () => {
    const fbCallback = facebookCallBack('token', 'refToken', user, callBackFunc);
    expect(fbCallback.msg).to.be.a('string');
  });
  it('shoudl test google passport', () => {
    const googleCallback = googleCallBack({ hello: 'jello' }, 'accToken', 'refresToke', user, callBackFunc);
    expect(googleCallback.msg).to.be.a('string');
  });
});

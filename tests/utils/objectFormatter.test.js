import chai from 'chai';
import objectFormatter from '../../src/utils/objectFormatter';
import mochData from '../data/passportAuthMockData';

const {
  fbObjectFormatter,
  googleObjectFormatter
} = objectFormatter;

const { expect } = chai;
describe('src/utils/objectFormatter', () => {
  it('Should test facebook object formatter', (done) => {
    const User = mochData[0];
    const { provider, _json: fbJsonObj } = User;
    const user = fbObjectFormatter(fbJsonObj, provider);
    expect(user.firstName).to.be.a('string');
    done();
  });
  it('Should test google object formatter', (done) => {
    const User = mochData[1];
    const { id, provider, _json: googleJsonObj } = User;
    const user = googleObjectFormatter(googleJsonObj, provider, id);
    expect(user.firstName).to.be.a('string');
    done();
  });
});

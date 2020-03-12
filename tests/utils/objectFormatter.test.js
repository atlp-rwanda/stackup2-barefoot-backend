import chai from 'chai';
import objectFormatter from '../../src/utils/objectFormatter';
import mochData from '../data/passportAuthMochData';

const {
  fbObjectFormatter,
  googleObjectFormatter
} = objectFormatter;

const { expect } = chai;
describe('src/utils/objectFormatter', () => {
  it('Should test facebook object formatter', (done) => {
    const User = mochData[0];
    const { provider } = User;
    const user = fbObjectFormatter(User._json, provider);
    expect(user.firstName).to.be.a('string');
    done();
  });
  it('Should test google object formatter', (done) => {
    const User = mochData[1];
    const { id, provider } = User;
    const user = googleObjectFormatter(User._json, provider, id);
    expect(user.firstName).to.be.a('string');
    done();
  });
});

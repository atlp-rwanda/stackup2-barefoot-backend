import chai from 'chai';
import passportService from '../../src/services/socialMedia.service';
import UserService from '../../src/services/authentication.service';
import mochData from '../data/passportAuthMockData';

const user = mochData[2];

describe('Passport services tests', () => {
  it('Should create a user in database', (done) => {
    passportService.createUser(user)
      .then(data => {
        chai.expect(data.dataValues.firstName).to.be.a('string');
        done();
      })
      .catch(error => { console.log(error); done(); });
  });
  it('Should find a user in database by social media id', (done) => {
    passportService.findUserById(user.socialMediaId)
      .then(data => {
        chai.expect(data.dataValues.firstName).to.be.a('string');
        done();
      })
      .catch(error => { console.log(error); done(); });
  });
  it('Should find a user in database by email', (done) => {
    UserService.findUserByEmail(user.email)
      .then(data => {
        chai.expect(data.dataValues.firstName).to.be.a('string');
        done();
      })
      .catch(error => { console.log(error); done(); });
  });
});

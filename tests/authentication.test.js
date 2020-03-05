import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/index';
import customMessages from '../src/utils/customMessages';
import statusCodes from '../src/utils/statusCodes';
import mockData from './data/mockData';

const { signupData, incompleteData } = mockData;

chai.use(chaiHttp);
chai.should();

describe('User sign up', () => {
  it('Should return 201', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(signupData)
      .end((err, res) => {
        const { message, token } = res.body;
        expect(res.status).to.equal(statusCodes.created);
        expect(message);
        expect(token);
        expect(message).to.equal(customMessages.userSignupSuccess);
        expect(token).to.be.a('string');
        done();
      });
  });
  it('Should return 400', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(incompleteData)
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(statusCodes.badRequest);
        expect(error);
        expect(error).to.equal(customMessages.userSignupFailed);
        done();
      });
  });
});

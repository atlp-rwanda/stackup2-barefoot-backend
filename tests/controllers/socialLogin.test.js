import chai from 'chai';
import chaiHttp from 'chai-http';
import express from 'express';
import 'dotenv/config';
import AuthPassportController from '../../src/controllers/authentication.controller';
import authMockData from '../data/passportAuthMockData';
import statusCode from '../../src/utils/statusCodes';
import customMessages from '../../src/utils/customMessages';

const { expect } = chai;

chai.use(chaiHttp);

const app = express();
const router = express.Router();

app.use(express.json());

router.post('/facebook', AuthPassportController.facebookLogin);
router.post('/google', AuthPassportController.googleLogin);

app.use(
  '/test/api/auth',
  (req, res, next) => {
    req.user = req.body;
    next();
  },
  router
);

const facebookObject = authMockData[0];
const googleObject = authMockData[1];

describe('Passport Authentication controller', () => {
  it('should authenticate a facebook user', (done) => {
    chai
      .request(app)
      .post('/test/api/auth/facebook')
      .send(facebookObject)
      .end((err, res) => {
        const { message, token } = res.body;
        expect(res.status).to.equal(statusCode.ok);
        expect(message);
        expect(token);
        expect(message).to.equal(customMessages.socialMediaAuthSucess);
        expect(token).to.be.a('string');
        done();
      });
  });

  it('should authenticate a facebook user twice', (done) => {
    chai
      .request(app)
      .post('/test/api/auth/facebook')
      .send(facebookObject)
      .end((err, res) => {
        const { message, token } = res.body;
        expect(res.status).to.equal(statusCode.ok);
        expect(message);
        expect(token);
        expect(message).to.equal(customMessages.socialMediaAuthSucess);
        expect(token).to.be.a('string');
        done();
      });
  });
  it('should authenticate a google user', (done) => {
    chai
      .request(app)
      .post('/test/api/auth/google')
      .send(googleObject)
      .end((err, res) => {
        const { message, token } = res.body;
        expect(res.status).to.equal(statusCode.ok);
        expect(message);
        expect(token);
        expect(message).to.equal(customMessages.socialMediaAuthSucess);
        expect(token).to.be.a('string');
        done();
      });
  });
  it('should authenticate a google user twice', (done) => {
    chai
      .request(app)
      .post('/test/api/auth/google')
      .send(googleObject)
      .end((err, res) => {
        const { message, token } = res.body;
        expect(res.status).to.equal(statusCode.ok);
        expect(message);
        expect(token);
        expect(message).to.equal(customMessages.socialMediaAuthSucess);
        expect(token).to.be.a('string');
        done();
      });
  });
});

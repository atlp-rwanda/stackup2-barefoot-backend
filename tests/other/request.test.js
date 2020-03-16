import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/index';
import customMessages from '../../src/utils/customMessages';
import statusCodes from '../../src/utils/statusCodes';
import mockData from '../data/mockData';
import loginToken from '../controllers/authentication.test';

const {
  oneWayTripRequest,
  oneWayTripRequester,
  returnTripRequest,
  returnTripInvalidType,
  invalidReturnDate
} = mockData;
const {
  invalidTravelType,
  oneWayTripRequestCreated,
  tokenInvalid,
  tokenMissing,
  userSignupSuccess,
  accountNotVerified,
  verifyMessage,
  duplicateTripRequest,
} = customMessages;
const {
  created,
  badRequest,
  unAuthorized,
  ok,
} = statusCodes;

chai.use(chaiHttp);
chai.should();

let authToken = '';

describe('One way trip request', () => {
  it('should create a trip requester(new user)', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(oneWayTripRequester)
      .end((err, res) => {
        if (err) done(err);
        const { message, token } = res.body;
        expect(res.status).to.equal(statusCodes.created);
        expect(message);
        expect(message).to.equal(userSignupSuccess);
        expect(token);
        authToken = `Bearer ${token}`;
        done();
      });
  });

  it('should not create a one way trip request for unverified users', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send(oneWayTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(unAuthorized);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(accountNotVerified);
        done();
      });
  });

  it('Should verify requester account', (done) => {
    chai.request(server)
      .get(`/api/auth/verify?token=${authToken.split(' ').pop()}`)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(ok);
        expect(message).to.be.a('string');
        expect(message).to.equal(verifyMessage);
        done();
      });
  });

  it('should create a one way trip request for verified users', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send(oneWayTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(data);
        expect(data).to.be.an('object');
        expect(message).to.be.a('string');
        expect(message).to.equal(oneWayTripRequestCreated);
        done();
      });
  });
  it('should create a return trip request for verified users', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send(returnTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(data);
        expect(data).to.be.an('object');
        expect(message).to.be.a('string');
        expect(message).to.equal(oneWayTripRequestCreated);
        done();
      });
  });
  it('should not create a duplicate one way trip request', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send(oneWayTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(duplicateTripRequest);
        done();
      });
  });
  it('should not create a duplicate return trip request', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send(returnTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(duplicateTripRequest);
        done();
      });
  });
  it('should not create a one way trip request with invalid travel type', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send({ ...oneWayTripRequest, travelType: 'invalid-travel-type' })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTravelType);
        done();
      });
  });

  it('should not create a one way trip request without travel type', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send({ ...oneWayTripRequest, travelType: undefined })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTravelType);
        done();
      });
  });

  it('should not create a one way trip request with invalid trip info', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send({ ...oneWayTripRequest, travelDate: 'invalid-travel-date' })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).to.equal(badRequest);
        done();
      });
  });

  it('should not create a one way trip request without an authorization token', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .send(oneWayTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(tokenMissing);
        done();
      });
  });

  it('should not create a one way trip request with invalid/expired token', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', 'Bearer invalid_expired_token')
      .send(oneWayTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(tokenInvalid);
        done();
      });
  });
});
describe('Return trip request', () => {
  it('should not create a return trip request for unverified users', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', loginToken.notVerified)
      .send(returnTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(unAuthorized);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(accountNotVerified);
        done();
      });
  });


  it('should not create a return trip request without return date', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send(invalidReturnDate)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(`${customMessages.invalidReturnDate}.`);
        done();
      });
  });

  it('should not create a return trip request with invalid travel type', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send(returnTripInvalidType)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTravelType);
        done();
      });
  });
  it('should not create a return trip request without travel type', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send({ ...returnTripRequest, travelType: undefined })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(invalidTravelType);
        done();
      });
  });
  it('should not create a return trip request with invalid trip info', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send({ ...returnTripRequest, travelDate: 'invalid-travel-date' })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).to.equal(badRequest);
        done();
      });
  });
  it('should not create a return trip request with invalid trip info', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', authToken)
      .send({ ...returnTripRequest, returnDate: 'invalid-return-date' })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).to.equal(badRequest);
        done();
      });
  });
  it('should not create a return trip request without an authorization token', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .send(returnTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(tokenMissing);
        done();
      });
  });

  it('should not create a return trip request with invalid/expired token', (done) => {
    chai
      .request(server)
      .post('/api/trips')
      .set('Authorization', 'Bearer invalid_expired_token')
      .send(returnTripRequest)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.be.a('string');
        expect(error).to.equal(tokenInvalid);
        done();
      });
  });
});

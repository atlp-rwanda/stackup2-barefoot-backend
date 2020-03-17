import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/index';
import statusCodes from '../../src/utils/statusCodes';
import customMessages from '../../src/utils/customMessages';
import accommodationMockData from '../data/accommodationMockData';
import userRoles from '../../src/utils/userRoles.utils';

const {
    created,
    ok,
    notFound,
    forbidden,
    conflict,
    badRequest
} = statusCodes;
const { TRAVEL_ADMIN, ACCOMMODATION_SUPPLIER } = userRoles;
const {
    accommodationCreated,
    accommodationRoomCreated,
    accommodationsRetrieved,
    noAccommodFoundInMatchInputs,
    notAllowedToCreateAccommodation,
    accommodationExistsErrMsg,
    notAllowedToCreateRoom,
    roomAlreadyExistsErrMsg,
    roomNumberEmpty,
    accommodationIdIntegerErrMsg,
    accommodationNotExistsErrMsg,
    roomDeleted, accommodationDeleted,
    roomIdShouldBeANumberErrMsg,
    notAllowedToUpdateRoom,
    pageNotFound,
  invalidBookAccommodationTripRequestId,
  accommodationNotExist,
  tripRequestNotExist,
  bookedAccommodation,
  duplicateAccommodationBookings,
  itemNotExist, cantDltAccommWithRooms
} = customMessages;
const {
    bookAccommodation,
    accommodationRoomValidData,
    accommodationValidData,
    accommodationCreatorTravelAdminTest,
    accommodationCreatorSupplierTest,
    superUserLogin,
    accommodationCreatorRequester,
    roomAccommodationNotExist,
    roomAccommodationIdIntegerError,
    updateAccommodationValidData,
    updateAccommodationRoomValidData,
    updateAccommodationRoomValidDataNoRoomName,
    accommodationInValidCurrency
} = accommodationMockData;
import mockData from '../data/mockData';

chai.use(chaiHttp);
let authTokenTravelAdmin, authTokenSupplier, authTokenRequester, superUserToken, requestId2 = '';
const requesterTripRequests = [];
const { oneWayTripRequestForAccommodationBooking } = mockData;

describe('Accommodation tests', () => {
    it('Will create an accommodation creator travel admin(new user)', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(accommodationCreatorTravelAdminTest)
      .end((err, res) => {
        if (err) done(err);
        done();
      });
    });
    it('Will create an accommodation creator supplier(new user)', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(accommodationCreatorSupplierTest)
      .end((err, res) => {
        if (err) done(err);
        done();
      });
    });
    it('Will create an accommodation creator requester(new user)', (done) => {
    chai
      .request(server)
      .post('/api/auth/signup')
      .send(accommodationCreatorRequester)
      .end((err, res) => {
          if (err) done(err);
          authTokenRequester = `Bearer ${res.body.token}`;
        done();
      });
    });
    
    it('Will login as superUser', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .send(superUserLogin)
            .end((err, res) => {
                if (err) done(err);
                superUserToken = `Bearer ${res.body.token}`;
                done();
        });
    });

    it('will assign travelAdmin role to a travel admin user', (done) => { 
        chai.request(server)
            .patch('/api/roles/assign-role')
            .set('Authorization', superUserToken)
            .send({ email: accommodationCreatorTravelAdminTest.email, role: TRAVEL_ADMIN })
            .end((err, res) => {
                if (err) done(err);
                done();
        });
    });
    it('will assign travelAdmin role to a travel admin user', (done) => { 
        chai.request(server)
            .patch('/api/roles/assign-role')
            .set('Authorization', superUserToken)
            .send({ email: accommodationCreatorSupplierTest.email, role: ACCOMMODATION_SUPPLIER })
            .end((err, res) => {
                if (err) done(err);
                done();
        });
    });
    
    it('will login travel admin', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .send({
                email: accommodationCreatorTravelAdminTest.email,
                password: accommodationCreatorTravelAdminTest.password
            })
            .end((err, res) => {
                if (err) done(err);
                authTokenTravelAdmin = `Bearer ${res.body.token}`;
                done();
            });
    });
    it('will login supplier', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .send({
                email: accommodationCreatorSupplierTest.email,
                password: accommodationCreatorSupplierTest.password
            })
            .end((err, res) => {
                if (err) done(err);
                authTokenSupplier = `Bearer ${res.body.token}`;
                done();
            });
    });

    it('Will verify the travel admin', (done) => {
    chai.request(server)
      .get(`/api/auth/verify?token=${authTokenTravelAdmin.split(' ').pop()}`)
      .end((err, res) => {
        if (err) done(err);
        done();
      });
  });
    it('Will verify the supplier', (done) => {
    chai.request(server)
      .get(`/api/auth/verify?token=${authTokenSupplier.split(' ').pop()}`)
      .end((err, res) => {
        if (err) done(err);
        done();
      });
  });
    it('Will verify the requester', (done) => {
    chai.request(server)
      .get(`/api/auth/verify?token=${authTokenRequester.split(' ').pop()}`)
      .end((err, res) => {
        if (err) done(err);
        done();
      });
  });
    it('Will not retrieve any accommodation, expect it to return an object with error message', (done) => {
        chai
            .request(server)
            .get('/api/accommodations')
            .set('Authorization', authTokenTravelAdmin)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(notFound);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(noAccommodFoundInMatchInputs);
                done();
            });
    });
    it('Will create accommodation, expect it to return an object with message and and data as properties', (done) => {
        chai
            .request(server)
            .post('/api/accommodations')
            .set('Authorization', authTokenTravelAdmin)
            .send(accommodationValidData)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(created);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').to.equal(accommodationCreated);
                expect(res.body).to.have.property('data').to.be.an('object');
                done();
            });
    });
    it('Will not create accommodation because it is already exist, expect it to return an object with error as property', (done) => {
        chai
            .request(server)
            .post('/api/accommodations')
            .set('Authorization', authTokenTravelAdmin)
            .send(accommodationValidData)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(conflict);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(accommodationExistsErrMsg);
                done();
            });
    });
    it('Will not create accommodation because accommodation name is invalid, expect it to return an object with error as property', (done) => {
        chai
            .request(server)
            .post('/api/accommodations')
            .set('Authorization', authTokenTravelAdmin)
            .send(accommodationInValidCurrency)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(badRequest);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal('currency must be a string');
                done();
            });
    });
    
    it('Will not create accommodation because is not travel admin, expect it to return an object with error as property', (done) => {
        chai
            .request(server)
            .post('/api/accommodations')
            .set('Authorization', authTokenRequester)
            .send(accommodationValidData)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(forbidden);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(notAllowedToCreateAccommodation);
                done();
            });
    });
    it('Will create accommodation room, expect it to return an object with message and and data as properties', (done) => {
        chai
            .request(server)
            .post('/api/accommodations/1/rooms')
            .set('Authorization', authTokenTravelAdmin)
            .send(accommodationRoomValidData)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(created);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').to.equal(accommodationRoomCreated);
                expect(res.body).to.have.property('data').to.be.an('object');
                done();
            });
    });
        it('Will not create room because is not travel admin, expect it to return an object with error as property', (done) => {
        chai
            .request(server)
            .post('/api/accommodations/1/rooms')
            .set('Authorization', authTokenRequester)
            .send(accommodationRoomValidData)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(forbidden);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(notAllowedToCreateRoom);
                done();
            });
        });
    it('Will not create room because it is already exists, expect it to return an object with error as property', (done) => {
        chai
            .request(server)
            .post('/api/accommodations/1/rooms')
            .set('Authorization', authTokenTravelAdmin)
            .send(accommodationRoomValidData)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(conflict);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(roomAlreadyExistsErrMsg);
                done();
            });
    });
    it('Will not create room because there is no data sent, expect it to return an object with error as property', (done) => {
        chai
            .request(server)
            .post('/api/accommodations/1/rooms')
            .set('Authorization', authTokenTravelAdmin)
            .send({})
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(badRequest);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(roomNumberEmpty);
                done();
            });
    });
    it('Will not create room because there accommodation does not exist, expect it to return an object with error as property', (done) => {
        chai
            .request(server)
            .post('/api/accommodations/1000/rooms')
            .set('Authorization', authTokenTravelAdmin)
            .send(roomAccommodationNotExist)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(notFound);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(accommodationNotExistsErrMsg);
                done();
            });
    });
    it('Will not create room because the accommodation Id sent is a string, expect it to return an object with error as property', (done) => {
        chai
            .request(server)
            .post('/api/accommodations/cool/rooms')
            .set('Authorization', authTokenTravelAdmin)
            .send(roomAccommodationIdIntegerError)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(badRequest);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(accommodationIdIntegerErrMsg);
                done();
            });
    });
    it('Will retrieve all accommodations without any constraints, expect it to return an object with message and and data as properties', (done) => {
        chai
            .request(server)
            .get('/api/accommodations')
            .set('Authorization', authTokenTravelAdmin)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(ok);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').to.equal(accommodationsRetrieved);
                expect(res.body).to.have.property('data').to.be.an('array');
                done();
            });
    });
    it('Will retrieve all accommodations with provided city, expect it to return an object with message and and data as properties', (done) => {
        chai
            .request(server)
            .get('/api/accommodations?city=kigali')
            .set('Authorization', authTokenTravelAdmin)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(ok);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').to.equal(accommodationsRetrieved);
                expect(res.body).to.have.property('data').to.be.an('array');
                done();
            });
    });
    it('Will not retrieve any accommodations when provided a page which does not exists, expect it to return an object with error', (done) => {
        chai
            .request(server)
            .get('/api/accommodations?page=5999')
            .set('Authorization', authTokenTravelAdmin)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(notFound);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(pageNotFound);
                done();
            });
    });
    it('Will update accommodations, expect it to return an object with data as property', (done) => {
        chai
            .request(server)
            .patch('/api/accommodations/1')
            .set('Authorization', authTokenTravelAdmin)
            .send(updateAccommodationValidData)
            .end((err, res) => {
                if (err) done(err);
                console.log(res.body);
                expect(res).to.have.status(ok);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('data').to.be.an('object');
                done();
            });
    });

    it(`Update accommodation picture, expecting to return code of 200, 
    and an object containing  error message`, (done) => {
    chai
      .request(server)
      .patch('/api/accommodations/1')
      .set('Authorization', authTokenTravelAdmin)
      .attach('accommodationImage', `${__dirname}/img/q-icon.png`)
      .end((err, res) => {
        if (err) done(err);
        console.log(res.body);
        expect(res).to.have.status(ok);
        expect(res.body).to.be.an('object');
        done();
      });
  });
   
    it('Will not update accommodations because accommodation Id is a string, expect it to return an object with error as properties', (done) => {
        chai
            .request(server)
            .patch('/api/accommodations/cool')
            .set('Authorization', authTokenTravelAdmin)
            .send(updateAccommodationValidData)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(badRequest);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.be.a('string').to.equal(accommodationIdIntegerErrMsg);
                done();
            });
    });
    it('Will update accommodation room as a travel admin do that, expect it to return an object with data as property', (done) => {
        chai
            .request(server)
            .patch('/api/accommodations/rooms/1')
            .set('Authorization', authTokenTravelAdmin)
            .send(updateAccommodationRoomValidData)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(ok);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('data').to.be.an('object');
                done();
            });
    });
    it('Will update accommodation room as an accommodation supplier does that, expect it to return an object with message and and data as properties', (done) => {
        chai
            .request(server)
            .patch('/api/accommodations/rooms/1')
            .set('Authorization', authTokenSupplier)
            .send(updateAccommodationRoomValidDataNoRoomName)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(ok);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('data').to.be.an('object');
                done();
            });
    });
    it('Will not update accommodation room because the room does not exist, expect it to return an object with error as properties', (done) => {
        chai
            .request(server)
            .patch('/api/accommodations/rooms/0')
            .set('Authorization', authTokenSupplier)
            .send(updateAccommodationRoomValidDataNoRoomName)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(notFound);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.be.a('string').to.equal(itemNotExist);
                done();
            });
    });
     it('Will not update accommodations because accommodation Id is empty, expect it to return an object with error as properties', (done) => {
        chai
            .request(server)
            .patch('/api/accommodations/rooms/1')
            .set('Authorization', authTokenTravelAdmin)
            .send(updateAccommodationRoomValidData)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(conflict);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.be.a('string').to.equal(roomAlreadyExistsErrMsg);
                done();
            });
    });
     it('Will not update accommodations because accommodation Id is empty, expect it to return an object with error as properties', (done) => {
        chai
            .request(server)
            .patch('/api/accommodations/rooms/1')
            .set('Authorization', authTokenRequester)
            .send(updateAccommodationRoomValidData)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(forbidden);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.be.a('string').to.equal(notAllowedToUpdateRoom);
                done();
            });
    });
     it('Will not update accommodations because accommodation Id is empty, expect it to return an object with error as properties', (done) => {
        chai
            .request(server)
            .patch('/api/accommodations/rooms/cool')
            .set('Authorization', authTokenSupplier)
            .send(updateAccommodationRoomValidData)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(badRequest);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.be.a('string').to.equal(roomIdShouldBeANumberErrMsg);
                done();
            });
     });
    
    
     it('should create a one way trip request for verified users', (done) => {
      chai
        .request(server)
        .post('/api/trips')
        .set('Authorization', authTokenRequester)
        .send(oneWayTripRequestForAccommodationBooking)
        .end((err, res) => {
          if (err) done(err);
          const { message, data } = res.body;
          requestId2 = data.id;
          requesterTripRequests.push(data);
          done();
        });
    });
  it('should not book an accommodation facility due to invalid booking info', (done) => {
      chai
          .request(server)
          .post('/api/accommodations/book')
          .set('Authorization', authTokenRequester)
          .send(bookAccommodation)
          .end((err, res) => {
              if (err) done(err);
              const { error } = res.body;
              expect(res.status).to.equal(badRequest);
              expect(error);
              expect(error).to.be.a('string');
              expect(error).to.equal(invalidBookAccommodationTripRequestId);
              done();
          });
  });
  it('should not book an accommodation facility due to invalid/non-existent trip request', (done) => {
      chai
          .request(server)
          .post('/api/accommodations/book')
          .set('Authorization', authTokenRequester)
          .send({
              ...bookAccommodation,
              tripRequestId: 9999999,
          })
          .end((err, res) => {
              if (err) done(err);
              const { error } = res.body;
              expect(res.status).to.equal(badRequest);
              expect(error);
              expect(error).to.be.a('string');
              expect(error).to.equal(tripRequestNotExist);
              done();
          });
  });
  it('should not book an accommodation facility due to invalid/non-existent accommodation facility', (done) => {
      chai
          .request(server)
          .post('/api/accommodations/book')
          .set('Authorization', authTokenRequester)
          .send({
              ...bookAccommodation,
              tripRequestId: requesterTripRequests[0].id,
              accommodationId: 9999999,
          })
          .end((err, res) => {
              if (err) done(err);
              const { error } = res.body;
              expect(res.status).to.equal(badRequest);
              expect(error);
              expect(error).to.be.a('string');
              expect(error).to.equal(accommodationNotExist);
              done();
          });
  });
  it('should book an accommodation facility', (done) => {
      chai
          .request(server)
          .post('/api/accommodations/book')
          .set('Authorization', authTokenRequester)
          .send({ ...bookAccommodation, tripRequestId: requesterTripRequests[0].requestId })
          .end((err, res) => {
              if (err) done(err);
              const { data, message } = res.body;
              expect(res.status).to.equal(created);
              expect(data);
              expect(data).to.be.an('object');
              expect(message);
              expect(message).to.be.a('string');
              expect(message).to.equal(bookedAccommodation);
              done();
          });
  });
  it('should not book an accommodation facility twice for the same trip', (done) => {
      chai
          .request(server)
          .post('/api/accommodations/book')
          .set('Authorization', authTokenRequester)
          .send({ ...bookAccommodation, tripRequestId: requesterTripRequests[0].requestId })
          .end((err, res) => {
              if (err) done(err);
              const { error } = res.body;
              expect(res.status).to.equal(badRequest);
              expect(error);
              expect(error).to.be.a('string');
              expect(error).to.equal(duplicateAccommodationBookings);
              done();
          });
  });
    
  it('Will delete not delete accommodation because it has some rooms, expect it to return an object with error as property', (done) => {
    chai
        .request(server)
        .delete('/api/accommodations/1')
        .set('Authorization', authTokenTravelAdmin)
        .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(badRequest);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error').to.be.a('string').to.equal(cantDltAccommWithRooms);
            done();
        });
});
    
    it('Will delete accommodation room, expect it to return an object with message and and data as properties', (done) => {
        chai
            .request(server)
            .delete('/api/accommodations/rooms/1')
            .set('Authorization', authTokenTravelAdmin)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(ok);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').to.be.a('string').to.equal(roomDeleted);
                done();
            });
    });
    it('Will delete accommodation, expect it to return an object with message and and data as properties', (done) => {
        chai
            .request(server)
            .delete('/api/accommodations/1')
            .set('Authorization', authTokenTravelAdmin)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(ok);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').to.be.a('string').to.equal(accommodationDeleted);
                done();
            });
    });
});

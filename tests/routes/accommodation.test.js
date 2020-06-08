import chai, {
    expect
} from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/index';
import statusCodes from '../../src/utils/statusCodes';
import customMessages from '../../src/utils/customMessages';
import accommodationMockData from '../data/accommodationMockData';
import userRoles from '../../src/utils/userRoles.utils';
import UserService from '../../src/services/user.service';
import mockData from '../data/mockData';

const {
    created,
    ok,
    notFound,
    forbidden,
    conflict,
    badRequest
} = statusCodes;
const {
    findUserByEmail
} = UserService;
const {
    TRAVEL_ADMIN,
    ACCOMMODATION_SUPPLIER
} = userRoles;

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
    roomDeleted,
    accommodationDeleted,
    roomIdShouldBeANumberErrMsg,
    notAllowedToUpdateRoom,
    pageNotFound,
    invalidBookAccommodationTripRequestId,
    accommodationNotExist,
    tripRequestNotExist,
    bookedAccommodation,
    duplicateAccommodationBookings,
    itemNotExist,
    cantDltAccommWithRooms,
    verifyMessage,
    userAccommodationReactionNotExist,
    reactedToAccommodation,
    invalidBookAccommodationAccommodationId,
    userSignupSuccess,
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
    accommodationInValidCurrency,
    accommodationValidData2,
    accommodationValidData3,
    invalidAccommodationId,
    nonExistentAccommodationId,
} = accommodationMockData;

let accommodationId;
let tripId;

chai.use(chaiHttp);

let authTokenTravelAdmin, authTokenSupplier, authTokenRequester, superUserToken, requestId2 = '';

const requesterTripRequests = [];
const {
    oneWayTripRequestForAccommodationBooking
} = mockData;
let newManagerId;

const {
    requester4Account,
} = mockData;

const accommodations = [];

let authTokenRequester2 = {};

describe('Accommodation tests', () => {
    before('Get manager ID', async () => {
        const manager = await findUserByEmail('jonsnow@gmail.com');
        newManagerId = manager.dataValues.id;
    });
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
            .send({
                ...accommodationCreatorRequester,
                lineManager: newManagerId
            })
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
            .send({
                email: accommodationCreatorTravelAdminTest.email,
                role: TRAVEL_ADMIN
            })
            .end((err, res) => {
                if (err) done(err);
                done();
            });
    });
    it('will assign travelAdmin role to a travel admin user', (done) => {
        chai.request(server)
            .patch('/api/roles/assign-role')
            .set('Authorization', superUserToken)
            .send({
                email: accommodationCreatorSupplierTest.email,
                role: ACCOMMODATION_SUPPLIER
            })
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
    it('Will delete accommodation, expect it to return an object with message and and data as properties', (done) => {
        chai
            .request(server)
            .delete('/api/accommodations/2')
            .set('Authorization', authTokenTravelAdmin)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(ok);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').to.be.a('string').to.equal(accommodationDeleted);
                done();
            });
    });
    it('Will delete accommodation, expect it to return an object with message and and data as properties', (done) => {
        chai
            .request(server)
            .delete('/api/accommodations/3')
            .set('Authorization', authTokenTravelAdmin)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(ok);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').to.be.a('string').to.equal(accommodationDeleted);
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
                accommodationId = res.body.data.id;
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
            .post(`/api/accommodations/${accommodationId}/rooms`)
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
            .post(`/api/accommodations/${accommodationId}/rooms`)
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
            .post(`/api/accommodations/${accommodationId}/rooms`)
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
            .post(`/api/accommodations/${accommodationId}/rooms`)
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
            .get('/api/accommodations?city=Nyabihu')
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
            .patch(`/api/accommodations/${accommodationId}`)
            .set('Authorization', authTokenTravelAdmin)
            .send(updateAccommodationValidData)
            .end((err, res) => {
                if (err) done(err);
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
            .patch(`/api/accommodations/${accommodationId}`)
            .set('Authorization', authTokenTravelAdmin)
            .attach('accommodationImage', `${__dirname}/img/q-icon.png`)
            .end((err, res) => {
                if (err) done(err);
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
                const {
                    message,
                    data
                } = res.body;
                requestId2 = data.id;
                requesterTripRequests.push(data);
                done();
            });
    });

    it('should create a  second one way trip request for verified users', (done) => {
        chai
            .request(server)
            .post('/api/trips')
            .set('Authorization', authTokenRequester)
            .send({
                ...oneWayTripRequestForAccommodationBooking,
                travelDate: new Date(Date.now() + 632000000)
            })
            .end((err, res) => {
                if (err) done(err);
                const {
                    message,
                    data
                } = res.body;
                tripId = data.id;
                requesterTripRequests.push(data);
                done();
            });
    });
    it('should not book an accommodation facility due to invalid booking info', (done) => {
        chai
            .request(server)
            .post('/api/accommodations/book')
            .set('Authorization', authTokenRequester)
            .send({
                ...bookAccommodation,
                accommodationId
            })
            .end((err, res) => {
                if (err) done(err);
                const {
                    error
                } = res.body;
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
                accommodationId,
                tripRequestId: 9999999,
            })
            .end((err, res) => {
                if (err) done(err);
                const {
                    error
                } = res.body;
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
                const {
                    error
                } = res.body;
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
            .send({
                ...bookAccommodation,
                accommodationId,
                tripRequestId: requesterTripRequests[0].id
            })
            .end((err, res) => {
                if (err) done(err);
                const {
                    data,
                    message
                } = res.body;
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
            .send({
                ...bookAccommodation,
                accommodationId,
                tripRequestId: requesterTripRequests[0].id
            })
            .end((err, res) => {
                if (err) done(err);
                const {
                    error
                } = res.body;
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
            .delete(`/api/accommodations/${accommodationId}`)
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
            .delete(`/api/accommodations/${accommodationId}`)
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


describe('Like/Dislike Accommodations', () => {
    it('Should create an accommodation facility 1', (done) => {
        chai
            .request(server)
            .post('/api/accommodations')
            .set('Authorization', authTokenTravelAdmin)
            .send(accommodationValidData2)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(created);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').to.equal(accommodationCreated);
                expect(res.body).to.have.property('data').to.be.an('object');
                accommodations.push(res.body.data);
                done();
            });
    });
    it('Should create an accommodation facility 2', (done) => {
        chai
            .request(server)
            .post('/api/accommodations')
            .set('Authorization', authTokenTravelAdmin)
            .send(accommodationValidData3)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(created);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').to.equal(accommodationCreated);
                expect(res.body).to.have.property('data').to.be.an('object');
                accommodations.push(res.body.data);
                done();
            });
    });
    it('Should create a requester account', (done) => {
        chai
        .request(server)
        .post('/api/auth/signup')
        .send(requester4Account)
        .end((err, res) => {
            if (err) done(err);
            const { message, token } = res.body;
            expect(message);
            expect(message).to.equal(userSignupSuccess);
            expect(token);
            authTokenRequester2 = `Bearer ${token}`;
            done();
        });
    });
    it('Should verify requester account', (done) => {
        chai.request(server)
        .get(`/api/auth/verify?token=${authTokenRequester2.split(' ').pop()}`)
        .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(ok);
            const { message } = res.body;
            expect(message).to.be.a('string');
            expect(message).to.equal(verifyMessage);
            done();
        });
    });
    it('Should login a requester', (done) => {
        chai
        .request(server)
        .post('/api/auth/login')
        .set('Accept', 'Application/json')
        .send({
            email: requester4Account.email,
            password: requester4Account.password,
        })
        .end((err, res) => {
            if (err) done(err);
            expect(res.status).to.equal(ok);
            const { token } = res.body;
            expect(token);
            authTokenRequester2 = `Bearer ${token}`;
            done();
        });
    });
    it('should not like an accommodation facility due to its absence', (done) => {
        chai
        .request(server)
        .post(`/api/accommodations/${nonExistentAccommodationId}/like`)
        .set('Authorization', authTokenRequester2)
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
    it('should not like an accommodation facility due to invalid accommodationId', (done) => {
        chai
        .request(server)
        .post(`/api/accommodations/${invalidAccommodationId}/like`)
        .set('Authorization', authTokenRequester2)
        .end((err, res) => {
            if (err) done(err);
            const { error } = res.body;
            expect(res.status).to.equal(badRequest);
            expect(error);
            expect(error).to.be.a('string');
            expect(error).to.equal(invalidBookAccommodationAccommodationId);
            done();
        });
    });
    it('should not dislike an accommodation facility due to its absence', (done) => {
        chai
        .request(server)
        .post(`/api/accommodations/${nonExistentAccommodationId}/dislike`)
        .set('Authorization', authTokenRequester2)
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
    it('should like(new) an accommodation facility', (done) => {
        chai
        .request(server)
        .post(`/api/accommodations/${accommodations[0].id}/like`)
        .set('Authorization', authTokenRequester2)
        .end((err, res) => {
            if (err) done(err);
            const { message } = res.body;
            expect(res.status).to.equal(created);
            expect(message);
            expect(message).to.be.a('string');
            expect(message).to.equal(reactedToAccommodation);
            done();
        });
    });
    it('should like(update) an accommodation facility', (done) => {
        chai
        .request(server)
        .post(`/api/accommodations/${accommodations[0].id}/like`)
        .set('Authorization', authTokenRequester2)
        .end((err, res) => {
            if (err) done(err);
            const { message } = res.body;
            expect(res.status).to.equal(created);
            expect(message);
            expect(message).to.be.a('string');
            expect(message).to.equal(reactedToAccommodation);
            done();
        });
    });
    it('should unlike an accommodation facility', (done) => {
        chai
        .request(server)
        .post(`/api/accommodations/${accommodations[0].id}/like`)
        .set('Authorization', authTokenRequester2)
        .end((err, res) => {
            if (err) done(err);
            const { message } = res.body;
            expect(res.status).to.equal(created);
            expect(message);
            expect(message).to.be.a('string');
            expect(message).to.equal(reactedToAccommodation);
            done();
        });
    });
    it('should dislike an accommodation facility(1)', (done) => {
        chai
        .request(server)
        .post(`/api/accommodations/${accommodations[0].id}/dislike`)
        .set('Authorization', authTokenRequester2)
        .end((err, res) => {
            if (err) done(err);
            const { message } = res.body;
            expect(res.status).to.equal(created);
            expect(message);
            expect(message).to.be.a('string');
            expect(message).to.equal(reactedToAccommodation);
            done();
        });
    });
    it('should un-dislike an accommodation facility', (done) => {
        chai
        .request(server)
        .post(`/api/accommodations/${accommodations[0].id}/dislike`)
        .set('Authorization', authTokenRequester2)
        .end((err, res) => {
            if (err) done(err);
            const { message } = res.body;
            expect(res.status).to.equal(created);
            expect(message);
            expect(message).to.be.a('string');
            expect(message).to.equal(reactedToAccommodation);
            done();
        });
    });
    it('should dislike an accommodation facility(2)', (done) => {
        chai
        .request(server)
        .post(`/api/accommodations/${accommodations[1].id}/dislike`)
        .set('Authorization', authTokenRequester2)
        .end((err, res) => {
            if (err) done(err);
            const { message } = res.body;
            expect(res.status).to.equal(created);
            expect(message);
            expect(message).to.be.a('string');
            expect(message).to.equal(reactedToAccommodation);
            done();
        });
    });
});

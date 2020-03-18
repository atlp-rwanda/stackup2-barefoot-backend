/* eslint-disable require-jsdoc */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcrypt';
import server from '../src/index';
import customMessages from '../src/utils/customMessages';
import statusCodes from '../src/utils/statusCodes';
import mockData from './data/mockData';
import handleSignUp from '../src/services/authentication.service';

let wrongToken;

const {
    userRoleData,
    realLoginDataFromTheDb2,
    userRoleDataEmailNotExist,
    invalidEmailForUserRole,
    invalidRoleForUserRole } = mockData;

let generatedToken;
chai.use(chaiHttp);
chai.should();

describe('Create user roles', () => {
    before(async () => {
        const signupData3 = {
            firstName: 'John',
            lastName: 'Doe',
            username: 'udoe',
            email: 'user@user.com',
            address: 'Kigali',
            password: bcrypt.hashSync('helloworld3', 10),
            gender: 'Male',
        };

        const signupData2 = {
            firstName: 'admin',
            lastName: 'admin',
            username: 'admin',
            email: 'admin@admin.com',
            address: 'Kigali',
            password: bcrypt.hashSync('helloworld3', 10),
            gender: 'Male',
        };

        await handleSignUp.handleSignUp(signupData2, 'superAdmin', true);
        await handleSignUp.handleSignUp(signupData3, 'requester', true);
    });

    it('Should login to super user', (done) => {
        chai
            .request(server)
            .post('/api/auth/login')
            .set('Accept', 'Application/json')
            .send(realLoginDataFromTheDb2)
            .end((err, res) => {
                if (err) done(err);
                const { token } = res.body;
                generatedToken = token;
                expect(res).to.have.status(statusCodes.ok);
                done();
            });
    });

    it('Should login to normal user to get wrong token', (done) => {
        chai
            .request(server)
            .post('/api/auth/login')
            .set('Accept', 'Application/json')
            .send({ email: 'user@user.com', password: 'helloworld3' })
            .end((err, res) => {
                if (err) done(err);
                const { token } = res.body;
                wrongToken = token;
                expect(res).to.have.status(statusCodes.ok);
                done();
            });
    });

    it('Should assign roles to users', (done) => {
        chai
            .request(server)
            .patch('/api/admin/assignrole')
            .set('Authorization', `bearer ${generatedToken}`)
            .send(userRoleData)
            .end((err, res) => {
                expect(res).to.have.status(statusCodes.ok);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').to.equal(customMessages.assignRoleMessage);
                done();
            });
    });

    it('Should not assign roles to users if not logged in as superAdmin', (done) => {
        chai
            .request(server)
            .patch('/api/admin/assignrole')
            .set('Authorization', `bearer ${wrongToken}`)
            .send(userRoleData)
            .end((err, res) => {
                expect(res).to.have.status(statusCodes.unAuthorized);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(customMessages.userNotAuthorized);
                done();
            });
    });

    it('Should not assign roles to users if user not exist', (done) => {
        chai
            .request(server)
            .patch('/api/admin/assignrole')
            .set('Authorization', `bearer ${generatedToken}`)
            .send(userRoleDataEmailNotExist)
            .end((err, res) => {
                expect(res).to.have.status(statusCodes.forbidden);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(customMessages.notExistUser);
                done();
            });
    });

    it('Should not assign user with invalid email', (done) => {
        chai
            .request(server)
            .patch('/api/admin/assignrole')
            .set('Authorization', `bearer ${generatedToken}`)
            .send(invalidEmailForUserRole)
            .end((err, res) => {
                expect(res).to.have.status(statusCodes.badRequest);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(customMessages.invalidEmail);
                done();
            });
    });

    it('Should not assign user with invalid role', (done) => {
        chai
            .request(server)
            .patch('/api/admin/assignrole')
            .set('Authorization', `bearer ${generatedToken}`)
            .send(invalidRoleForUserRole)
            .end((err, res) => {
                expect(res).to.have.status(statusCodes.badRequest);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(customMessages.invalidRole);
                done();
            });
    });
});

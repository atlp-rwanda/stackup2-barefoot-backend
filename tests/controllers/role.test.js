import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/index';
import customMessages from '../../src/utils/customMessages';
import statusCodes from '../../src/utils/statusCodes';
import mockData from '../data/mockData';

let generatedToken, notAdmin, adminToken;
const { 
    loginSuperUser, 
    assignRole, 
    adminRole,
    assignRoleNotUser, 
    assignWrongRole, 
    assignRoleInvalidEmail,
    normalUser,
    adminUser,
    changeSuperUser,
    assignExistingRole,
    loginAdminUser
} = mockData;
chai.use(chaiHttp);
chai.should();

describe('Assigning role to user', () => {
    it('Should create a normal user', (done) => {
        chai
          .request(server)
          .post('/api/auth/signup')
          .send(normalUser)
          .end((err, res) => {
            if (err) done(err);
            const { message, token } = res.body;
            notAdmin = token;
            expect(res.status).to.equal(statusCodes.created);
            expect(message);
            expect(message).to.equal(customMessages.userSignupSuccess);
            expect(token);
            done();
          });
      });
      it('Should create an admin user', (done) => {
        chai
          .request(server)
          .post('/api/auth/signup')
          .send(adminUser)
          .end((err, res) => {
            if (err) done(err);
            const { message, token } = res.body;
            adminToken = token;
            expect(res.status).to.equal(statusCodes.created);
            expect(message);
            expect(message).to.equal(customMessages.userSignupSuccess);
            expect(token);
            done();
          });
      });
      it('Should verify the normal user', (done) => {
        chai.request(server)
          .get(`/api/auth/verify?token=${notAdmin}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            done();
          });
      });
      it('Should verify the admin user', (done) => {
        chai.request(server)
          .get(`/api/auth/verify?token=${adminToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            done();
          });
      });
    it('Should signin as super User', done => {
        chai
            .request(server)
            .post('/api/auth/login')
            .set('Accept', 'Application/json')
            .send(loginSuperUser)
            .end((err, res) => {
                if (err) done(err);
                const { token } = res.body;
                generatedToken = `Bearer ${token}`;
                expect(res).to.have.status(statusCodes.ok);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').to.equal(customMessages.loginSuccess);
                done();
            });
    });
    it('Super admin should assign role', done => {
        chai
            .request(server)
            .patch('/api/roles/assign-role')
            .set('Accept', 'Application/json')
            .set('authorization', generatedToken)
            .send(assignRole)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(statusCodes.ok);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').to.equal(customMessages.roleAssigned);
                done();
            });
    });
    it('Super admin should not assign existing role', done => {
        chai
            .request(server)
            .patch('/api/roles/assign-role')
            .set('Accept', 'Application/json')
            .set('authorization', generatedToken)
            .send(assignExistingRole)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(statusCodes.badRequest);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(customMessages.existingRole);
                done();
            });
    });
    it('Super admin should assign admin role', done => {
        chai
            .request(server)
            .patch('/api/roles/assign-role')
            .set('Accept', 'Application/json')
            .set('authorization', generatedToken)
            .send(adminRole)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(statusCodes.ok);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').to.equal(customMessages.roleAssigned);
                done();
            });
    });
    it('Should signin as admin User', done => {
        chai
            .request(server)
            .post('/api/auth/login')
            .set('Accept', 'Application/json')
            .send(loginAdminUser)
            .end((err, res) => {
                if (err) done(err);
                const { token } = res.body;
                adminToken = `Bearer ${token}`;
                expect(res).to.have.status(statusCodes.ok);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').to.equal(customMessages.loginSuccess);
                done();
            });
    });
    it('should not change super user role', done => {
        chai
            .request(server)
            .patch('/api/roles/assign-role')
            .set('Accept', 'Application/json')
            .set('authorization', adminToken)
            .send(changeSuperUser)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(statusCodes.badRequest);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(customMessages.superUser);
                done();
            });
    });
    it('normal user should not assign role', done => {
        chai
            .request(server)
            .patch('/api/roles/assign-role')
            .set('Accept', 'Application/json')
            .set('authorization', `Bearer ${notAdmin}`)
            .send(assignRole)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(statusCodes.unAuthorized);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(customMessages.userNotAllowedForAction);
                done();
            });
    });
    it('Super admin should not assign role to a user who does not exist', done => {
        chai
            .request(server)
            .patch('/api/roles/assign-role')
            .set('Accept', 'Application/json')
            .set('authorization', generatedToken)
            .send(assignRoleNotUser)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(statusCodes.forbidden);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(customMessages.notExistUser);
                done();
            });
    });
    it('Super admin should not assign wrong role', done => {
        chai
            .request(server)
            .patch('/api/roles/assign-role')
            .set('Accept', 'Application/json')
            .set('authorization', generatedToken)
            .send(assignWrongRole)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(statusCodes.badRequest);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(customMessages.invalidRole);
                done();
            });
    });
    it('Super admin should not assign role to an invalid email', done => {
        chai
            .request(server)
            .patch('/api/roles/assign-role')
            .set('Accept', 'Application/json')
            .set('authorization', generatedToken)
            .send(assignRoleInvalidEmail)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(statusCodes.badRequest);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('error').to.equal(customMessages.invalidEmail);
                done();
            });
    });
});

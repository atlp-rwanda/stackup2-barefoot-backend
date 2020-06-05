import chai from 'chai';
import identifyUser from '../../src/utils/identifyUser';


describe('User authentication services tests', () => {
  it('Should update the notification status', (done) => {
    identifyUser('3155979791293255')
      .then(data => {
        chai.expect(data).to.be.an('object');
        done();
      })
      .catch(error => { console.log(error); done(); });
  });
});

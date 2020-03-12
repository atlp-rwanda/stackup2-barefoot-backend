import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/index';
import customMessages from '../../src/utils/customMessages';
import statusCodes from '../../src/utils/statusCodes';

const { notFound } = statusCodes;
const { endpointNotFound } = customMessages;

chai.use(chaiHttp);
chai.should();

describe('Server availability', () => {
  it('Should return not found', (done) => {
    chai
      .request(server)
      .get('/non-existent-endpoint')
      .end((err, res) => {
        const { message } = res.body;
        expect(res.status).to.equal(notFound);
        expect(message);
        expect(message).to.be.a('string');
        expect(message).to.equal(endpointNotFound);
        done();
      });
  });
});

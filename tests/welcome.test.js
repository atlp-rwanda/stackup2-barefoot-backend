import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/index';

chai.use(chaiHttp);
chai.should();

describe('Welcome route', () => {
    it('Welcome route should return object', (done) => {
        chai
        .request(server)
        .get('/')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            expect(res.body.message).to.equal('welcome');
            done();
        });
    });
});


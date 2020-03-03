import chai from 'chai';
import generateUsername from '../../src/utils/usernameGenerator.utils';
import mochData from '../data/mockData';

const {
    usernameGeneratorUtil,
} = mochData;
const { firstName, lastName } = usernameGeneratorUtil;
const { expect } = chai;
describe('src/utils/usernameGenerator.utls', () => {
    it('Should generate a username for users without email', (done) => {
        const username = generateUsername(firstName, lastName);
        expect(username).to.be.a('string');
        done();
    });
});

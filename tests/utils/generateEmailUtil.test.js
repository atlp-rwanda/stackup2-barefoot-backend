import chai from 'chai';
import generatEmail from '../../src/utils/generateEmail.utils';
import mochData from '../data/mockData';

const {
    emailGeneratorUtil
} = mochData;
const { email } = emailGeneratorUtil;
const { expect } = chai;
describe('src/utils/usernameGenerator.utls', () => {
    it('Should generate not generate an email given email is provided', (done) => {
        const result = generatEmail(email);
        expect(result).to.be.a('string');
        done();
    });
    it('Should generate generate an email given email is not provided', (done) => {
        const result = generatEmail();
        expect(result).to.be.a('string');
        done();
    });
});

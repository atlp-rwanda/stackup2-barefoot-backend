import chai from 'chai';
import sinonChai from 'sinon-chai';
import { sequelize, dataTypes, checkPropertyExists } from 'sequelize-test-helpers';
import UserModel from '../../src/database/models/user';

chai.use(sinonChai);

describe('src/models/User', () => {
  const User = UserModel(sequelize, dataTypes);
  const users = new User();

  context('properties', () => {
    [
      'firstName',
      'lastName',
      'email',
      'socialMediaId',
      'provider',
    ].forEach(checkPropertyExists(users));
  });
});

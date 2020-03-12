import chai from 'chai';
import sinonChai from 'sinon-chai';
import { sequelize, dataTypes, checkPropertyExists } from 'sequelize-test-helpers';
import UserModel from '../../src/database/models/user';

const { expect } = chai;
chai.use(sinonChai);

describe('src/models/User', () => {
  const User = UserModel(sequelize, dataTypes);
  const users = new User();

  context('properties', () => {
    [
      'firstName',
      'lastName',
      'email',
      'social_media_id',
      'provider',
    ].forEach(checkPropertyExists(users));
  });
});

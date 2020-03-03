import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import { Sequelize } from 'sequelize';

require('dotenv').config();

const basename = _basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config.js')[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

readdirSync(__dirname)
  .filter((file) => {
    const isTrue = (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    return isTrue;
  })
  .forEach((file) => {
    const model = sequelize.import(join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

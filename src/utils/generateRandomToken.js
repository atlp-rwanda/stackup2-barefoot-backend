/* eslint-disable require-jsdoc */
import bcrypt from 'bcrypt';

const randomToken = () => {
  const between = (min, max) => Math.floor((Math.random() * (max - min)) + min);

  const hashed = bcrypt.hashSync(`${between(1000, 1000000)}`, 10);
  return hashed;
};

export default randomToken;

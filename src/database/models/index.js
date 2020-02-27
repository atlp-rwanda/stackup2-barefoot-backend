import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const DATABASE_URI = `postgres://${process.env.DEV_DB_USERNAME}:${process.env.DEV_DB_PASSWORD}@${process.env.DEV_DB_HOSTNAME}:${process.env.DEV_DB_PORT}/${process.env.DEV_DB_NAME}`;
const pool = new pg.Pool({
  connectionString: DATABASE_URI,
});

pool.on('connect', () => {
});

const connect = () => {
  pool
    .query('SELECT now();')
    .then((res) => {
      pool.end();
    })
    .catch((err) => {
      pool.end();
    });
  pool.on('remove', () => {
    process.exit(0);
  });
};


export { connect, pool };

require('make-runnable');

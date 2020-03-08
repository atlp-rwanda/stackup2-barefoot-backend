import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { serve, setup } from 'swagger-ui-express';
import '@babel/polyfill';
import swaggerSpecs from '../public/api-docs/swagger.json';
import router from './routes/index';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

router.use('/public/api-docs', serve, setup(swaggerSpecs));

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'welcome' });
});

app.use(router);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});

export default app;

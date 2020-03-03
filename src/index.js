import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { serve, setup } from 'swagger-ui-express';
import '@babel/polyfill';
import swaggerSpecs from '../public/api-docs/swagger.json';
import allRoutes from './routes/index';
import passport from './config/passport';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const docRouter = express.Router();

docRouter.use('/public/api-docs', serve, setup(swaggerSpecs));

app.use(docRouter);

app.use(cors());
app.use(morgan('development'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'welcome' });
});
app.use(allRoutes);

const server = app.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`);
});

export default app;

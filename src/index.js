import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { serve, setup } from 'swagger-ui-express';
import '@babel/polyfill';
import fileupload from 'express-fileupload';
import swaggerSpecs from '../public/api-docs/swagger.json';
import allRoutes from './routes/index';
import passport from './config/passport';
import customMessages from './utils/customMessages';
import statusCodes from './utils/statusCodes';

dotenv.config();

const app = express();
const port = process.env.PORT;
const docRouter = express.Router();
const { notFound } = statusCodes;
const { endpointNotFound } = customMessages;

docRouter.use('/public/api-docs', serve, setup(swaggerSpecs));

app.use(docRouter);

app.use(cors());
app.use(morgan('development'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileupload({ useTempFiles: true }));
app.use(express.static(`${__dirname}/public`));
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'welcome' });
});
app.use(allRoutes);

app.use((req, res, next) => {
  res.status(notFound).json({
    message: endpointNotFound,
  });
});

const server = app.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`);
});

export default app;

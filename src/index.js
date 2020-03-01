import express from 'express';
import { serve, setup } from 'swagger-ui-express';
import SwaggerSpecs from '../public/api-docs/swagger.json';

const app = express();

const router = express.Router();
router.use('/public/api-docs', serve, setup(SwaggerSpecs));

app.use(router);

app.get('/api/v1', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome!',
  });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'welcome' });
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});

module.exports = server;

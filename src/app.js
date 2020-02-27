import express from 'express';
import swaggerUi from 'swagger-ui-express';
import SwaggerSpecs from '../public/api-docs/swagger.json';

const app = express();
const port = process.env.PORT || 3000;

const router = express.Router();

router.use('/public/api-docs', swaggerUi.serve,
  swaggerUi.setup(SwaggerSpecs));

app.use(router);

app.get('/api/v1', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome!',
  });
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

export default app;

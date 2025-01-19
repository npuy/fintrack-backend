import express from 'express';
import indexRoutes from './routes/index';
import authRoutes from './routes/auth';
import accountRoutes from './routes/account';
import categoryRoutes from './routes/category';
import transactionRoutes from './routes/transaction';
import cors from 'cors';
import { env } from './configs/config';
import { errorHandler } from './configs/error_handler';
import swaggerUi from 'swagger-ui-express';

const app = express();
const port = env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(require('../swagger-output.json')),
);

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/account', accountRoutes);
app.use('/category', categoryRoutes);
app.use('/transaction', transactionRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

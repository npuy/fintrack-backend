import express from 'express';
import dotenv from 'dotenv';
import indexRoutes from './routes/index';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use('/', indexRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

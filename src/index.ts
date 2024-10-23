import express from 'express';
import dotenv from 'dotenv';
import indexRoutes from './routes/index';
import userRoutes from './routes/user';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/', indexRoutes);
app.use('/user', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

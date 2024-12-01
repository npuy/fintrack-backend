import express from 'express';
import dotenv from 'dotenv';
import indexRoutes from './routes/index';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/', indexRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

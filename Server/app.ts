import express from 'express';
import { HttpStatus } from './constants/HttpStatus.js';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieparser from 'cookie-parser';
import { errorHandling } from './middlewares/ErrorHandling.js';
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { connectMongo } from './config/connectDB.js';

dotenv.config();
const app = express();
connectMongo();

const PORT = process.env.PORT || 3000;
const allowedOrigins = process.env.CLIENT_URL?.split(',');

app.use(express.json());
app.use(cookieparser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use('/api', authRoutes);
app.use('/api', uploadRoutes);

app.get('/health', (req, res) => {
  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Health Checked',
  });
});

app.use(errorHandling);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

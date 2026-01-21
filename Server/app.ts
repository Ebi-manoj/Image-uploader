import express from 'express';
import { HttpStatus } from './constants/HttpStatus.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;
const allowedOrigins = process.env.CLIENT_URL?.split(',');

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.get('/health', (req, res) => {
  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Health Checked',
  });
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

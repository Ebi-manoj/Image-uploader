import express from 'express';
import { HttpStatus } from './constants/HttpStatus.js';

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Health Checked',
  });
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

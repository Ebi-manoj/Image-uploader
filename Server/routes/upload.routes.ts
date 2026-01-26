import express from 'express';
import { uploadController } from '../controllers/upload.controller.js';

const router = express.Router();

router.get('/upload/signature', uploadController.getSignature);

export default router;

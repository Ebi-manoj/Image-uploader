import express from 'express';
import { uploadController } from '../controllers/upload.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/upload/signature',authMiddleware, uploadController.getSignature);
router.post('/upload/images', authMiddleware, uploadController.saveImages);

export default router;

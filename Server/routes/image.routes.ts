import express from 'express';
import { imageController } from '../controllers/image.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, imageController.saveImages);
router.patch('/', authMiddleware, imageController.updateImageOrder);
router.put('/:id', authMiddleware, imageController.editImage);

export default router;

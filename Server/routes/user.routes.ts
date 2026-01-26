import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { userController } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/image', authMiddleware, userController.getImages);
router.patch('/image/order', authMiddleware, userController.updateImageOrder);

export default router;

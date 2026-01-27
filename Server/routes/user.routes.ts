import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { userController } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/image', authMiddleware, userController.getImages);
router.get('/signature', authMiddleware, userController.getSignature);

export default router;

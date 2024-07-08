import express from 'express';
import { getuser,registerUser, loginUser, forgotPassword, resetPassword, } from '../Controllers/authControllers.js';
import authMiddleware from '../Middleware/authMiddeware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forget', forgotPassword);
router.post('/reset', resetPassword);
router.get('/getuser', authMiddleware, getuser);

export default router;

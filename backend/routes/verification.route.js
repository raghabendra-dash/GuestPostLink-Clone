import express from 'express';
import { verifyPaymentdomain, verifyPaymentContent } from '../controllers/verification.controller.js';

const router = express.Router();
router.post('/verify-payment-domain', verifyPaymentdomain);
router.post('/verify-payment-content', verifyPaymentContent);

export default router;
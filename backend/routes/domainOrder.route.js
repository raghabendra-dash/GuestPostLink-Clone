import express from 'express';
import { createOrderForDomain, getAllDomainOrders, getDomainOrderById } from '../controllers/domainOrder.controller.js';

const router = express.Router();
router.post('/create-order', createOrderForDomain);
router.get('/orders/:userId', getAllDomainOrders);
router.get('/order/:id', getDomainOrderById);

export default router;
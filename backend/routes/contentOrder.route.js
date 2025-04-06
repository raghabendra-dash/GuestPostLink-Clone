import express from 'express';
import { createOrderForContent } from '../controllers/contentOrder.controller.js';

const router = express.Router();
router.post("/create-order", createOrderForContent);

export default router;
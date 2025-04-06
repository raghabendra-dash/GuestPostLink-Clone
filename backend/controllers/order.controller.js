import express from 'express';
import Order from '../models/order.model';

const router = express.Router();

router.put('/update-status/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {

    console.error('Error updating order status:', error.message);
    
    res.status(500).json({ error: error.message });
  }
});

export default router;

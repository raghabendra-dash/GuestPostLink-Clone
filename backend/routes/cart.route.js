import express from "express";
import Cart from "../models/cart.model.js";

const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate('items.websiteId');
    
    if (!cart) {
      return res.status(200).json({ 
        success: true,
        items: [],
        websites: [] 
      });
    }
    
    res.status(200).json({
      success: true,
      items: cart.items,
      websites: cart.items.map(item => item.websiteId)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

router.post("/:userId/items", async (req, res) => {
  try {
    const { userId } = req.params;
    const { websiteId } = req.body;
    const websiteIdStr = websiteId.toString();

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.websiteId.toString() === websiteIdStr
    );

    if (existingItem) {
      return res.status(400).json({ 
        success: false, 
        message: 'Item already in cart' 
      });
    }

    cart.items.push({ websiteId: websiteIdStr }); 
    await cart.save();

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

router.delete("/:userId/items/:websiteId", async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.websiteId.toString() !== req.params.websiteId);
    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.websiteId");
    res.status(200).json({ success: true, cart: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const result = await Cart.deleteOne({ userId: req.params.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
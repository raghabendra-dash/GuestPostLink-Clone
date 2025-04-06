import Cart from "../models/cart.model.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, websiteId } = req.body;

    if (!userId || !websiteId) {
      return res.status(400).json({ success: false, message: "userId and websiteId are required" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, websites: [websiteId] });
    } else {
      if (cart.websites.includes(websiteId)) {
        return res.status(400).json({ success: false, message: "Item already in cart" });
      }
      cart.websites.push(websiteId);
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("websites");

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getTotalCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });

    const totalItems = cart ? cart.websites.length : 0;
    res.status(200).json({ success: true, totalItems });
  } catch (error) {
    console.error("Error getting total cart items:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, websiteId } = req.params;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.websites = cart.websites.filter((id) => id.toString() !== websiteId);

    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    await Cart.deleteOne({ userId });

    res.status(200).json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

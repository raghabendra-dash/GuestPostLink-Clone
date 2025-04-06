import DomainOrder from "../models/domainOrder.model.js";
import dotenv from "dotenv";
import Razorpay from "razorpay";

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrderForDomain = async (req, res) => {
  try {
    const { userId, websites, totalPrice } = req.body;

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ message: "Invalid total price" });
    }

    const options = {
      amount: totalPrice,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    const newDomainOrder = new DomainOrder({
      userId,
      websites,
      totalPrice: totalPrice / 100,
      razorpayOrderId: razorpayOrder.id,
    });

    await newDomainOrder.save();

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount / 100,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Error Creating Razorpay Order:", error);
    return res
      .status(500)
      .json({ message: "Failed to create Razorpay order", error });
  }
};

export const getAllDomainOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const domainOrders = await DomainOrder.find({ userId });

    res.status(200).json({ success: true, orders: domainOrders });
  } catch (error) {
    console.error("Error Fetching Domain Orders:", error);
    return res.status(500).json({ message: "Failed to fetch domain orders" });
  }
};

export const getDomainOrderById = async (req, res) => {
  try {
    const domainOrder = await DomainOrder.findById(req.params.id);

    if (!domainOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ success: true, domainOrder });
  } catch (error) {
    console.error("Error Fetching Domain Order:", error);
    return res.status(500).json({ message: "Failed to fetch domain order" });
  }
};

import ContentOrder from "../models/contentOrder.model.js";

import dotenv from "dotenv";
import Razorpay from "razorpay";

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrderForContent = async (req, res) => {
  try {
    const { userId, selectedPackage } = req.body;

    const options = {
      amount: selectedPackage.price * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    const newContentOrder = new ContentOrder({
      userId,
      package: selectedPackage,
      razorpayOrderId: razorpayOrder.id,
    });

    await newContentOrder.save();

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Error Creating Razorpay Order:", error);
    return res
      .status(500)
      .json({ message: "Failed to create Razorpay order", error });
  }
};

import DomainOrder from "../models/domainOrder.model.js";
import ContentOrder from "../models/contentOrder.model.js";
import { hmac } from "fast-sha256";
import { TextEncoder } from "util";

const matchSignature = (
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const data = razorpay_order_id + "|" + razorpay_payment_id;

  const encoder = new TextEncoder();
  const secretKey = encoder.encode(secret);
  const message = encoder.encode(data);
  const generatedSignature = Buffer.from(hmac(secretKey, message)).toString(
    "hex"
  );
  return generatedSignature === razorpay_signature;
};

export const verifyPaymentdomain = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      matchSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
    ) {
      await DomainOrder.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          paymentStatus: "paid",
          paymentDetails: {
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
          },
          status: "completed", 
        },
        { new: true } 
      );

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const verifyPaymentContent = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      matchSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
    ) {
      await ContentOrder.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          paymentStatus: "paid",
          paymentDetails: {
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
          },
          status: "completed", 
        },
        { new: true } 
      );

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

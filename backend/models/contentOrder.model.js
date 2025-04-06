import mongoose from "mongoose";

const contentOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    package: {
      id: { type: Number, required: true },
      name: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      wordCount: { type: Number, required: true },
      deliveryDays: { type: Number, required: true },
      features: { type: [String], required: true },
    },
    status: {
      type: String,
      enum: ["created", "in-progress", "completed", "rejected"],
      default: "created",
    },
    razorpayOrderId: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentDetails: {
      // To capture additional Razorpay payment information
      paymentId: { type: String },
      signature: { type: String },
    },
  },
  { timestamps: true }
);

const ContentOrder = mongoose.model("ContentOrder", contentOrderSchema);
export default ContentOrder;

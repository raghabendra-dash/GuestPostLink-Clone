import mongoose from "mongoose";

const domainOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true, default: Date.now },
    websites: [
      {
        websiteId: { type: String, required: true },
        websiteName: { type: String, required: true },
        price: { type: Number, required: true },
        title: { type: String, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
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

const DomainOrder = mongoose.model("DomainOrder", domainOrderSchema);
export default DomainOrder;

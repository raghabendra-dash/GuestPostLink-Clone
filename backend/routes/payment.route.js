import express from "express";
import crypto from "crypto";
import DomainOrder from "../models/domainOrder.model.js";
import ContentOrder from "../models/contentOrder.model.js";

const router = express.Router();

router.post("/razorpay-webhook", async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(JSON.stringify(req.body));
    const digest = hmac.digest("hex");

    if (digest !== req.headers["x-razorpay-signature"]) {
        return res.status(400).json({ error: "Invalid signature" });
    }

    const { payload } = req.body;
    const payment = payload.payment.entity;

    try {
        const order = await DomainOrder.findOneAndUpdate(
            { razorpayOrderId: payment.order_id },
            { paymentStatus: payment.status === "captured" ? "paid" : "failed" },
            { new: true }
        );
        
        if (!order) {
            await ContentOrder.findOneAndUpdate(
                { razorpayOrderId: payment.order_id },
                { paymentStatus: payment.status === "captured" ? "paid" : "failed" },
                { new: true }
            );
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to update payment status" });
    }
});

export default router;

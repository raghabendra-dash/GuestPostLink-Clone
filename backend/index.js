import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import websiteRoute from "./routes/website.route.js";
import domainOrderRoute from "./routes/domainOrder.route.js";
import contentOrderRoute from './routes/contentOrder.route.js';
import ordersRoute from './routes/orders.route.js';
import cartRoute from "./routes/cart.route.js";
import paymentVerificationRoute from "./routes/verification.route.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";

// 1. Load environment variables
dotenv.config();
console.log("Server starting...");
console.log("Mode:", process.env.NODE_ENV || "development");
console.log("Port:", process.env.PORT || 5000);

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Basic CORS setup
app.use(cors({
  origin: ["http://localhost:5173", "https://guest-front.vercel.app"],
  credentials: true
}));

// 3. Essential middleware
app.use(express.json());
app.use(cookieParser());

// 4. Simple health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

// 5. Route setup
app.use("/api/auth", authRoute);
app.use("/api/marketplace", websiteRoute);
app.use("/api/domain", domainOrderRoute);
app.use("/api/content", contentOrderRoute);
app.use("/api/cart", cartRoute);
app.use("/api/paymentVerification", paymentVerificationRoute);
app.use('/api/orders', ordersRoute);

// 6. Basic error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Something went wrong" });
});

// 7. Start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`CORS enabled for: ${["http://localhost:5173", "https://guest-front.vercel.app"].join(", ")}`);
    });
  })
  .catch(err => {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  });

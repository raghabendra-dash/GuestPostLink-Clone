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

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://guest-post-link-clone-front.vercel.app/"
];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoute);
app.use("/api/marketplace", websiteRoute);
app.use("/api/domain", domainOrderRoute);
app.use("/api/content", contentOrderRoute);
app.use("/api/cart", cartRoute);  
app.use("/api/paymentVerification", paymentVerificationRoute);
app.use('/api/orders', ordersRoute);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server running at port ${PORT} ✅`);
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
});

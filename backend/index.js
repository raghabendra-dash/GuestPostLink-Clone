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
  "https://guest-front.vercel.app"
];


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

app.use("/api/auth", authRoute);
app.use("/api/marketplace", websiteRoute);
app.use("/api/domain", domainOrderRoute);
app.use("/api/content", contentOrderRoute);
app.use("/api/cart", cartRoute);  
app.use("/api/paymentVerification", paymentVerificationRoute);
app.use('/api/orders', ordersRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal server error!');
});

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server running at port ${PORT} ✅`);
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
});

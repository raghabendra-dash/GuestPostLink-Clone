import express from "express";
import {
  create,
  fetchAll,
  getWebsite,
  addToCart,
  removeFromCart
} from "../controllers/website.controller.js";

const router = express.Router();

// Website routes
router.post("/create", create);
router.get("/websites", fetchAll);
router.get("/websites/:id", getWebsite);

// Cart routes
router.post("/cart", addToCart); 
router.delete("/cart/:userId/:websiteId", removeFromCart);

export default router;

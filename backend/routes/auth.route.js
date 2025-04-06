import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.get("/logout", logoutUser);

export default router;

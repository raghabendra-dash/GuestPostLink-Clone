import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000 
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role = "buyer" } = req.body;
    
   
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ 
        success: false,
        message: "User already exists" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    res.cookie('token', token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "Account created success",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });

  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ 
      success: false,
      message: process.env.NODE_ENV === 'development' 
        ? err.message 
        : "Registration failed." 
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { userId: "admin123", role: "admin" }, 
        process.env.JWT_SECRET, 
        { expiresIn: "1d" }
      );

      res.cookie('token', token, cookieOptions);

      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        user: { 
          _id: "admin123", 
          name: "Admin", 
          email, 
          role: "admin" 
        }
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    res.cookie('token', token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      success: false,
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : "Login failed. Please try again." 
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie('token', cookieOptions);
    return res.status(200).json({ 
      success: true,
      message: "Logged out successfully" 
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ 
      success: false,
      message: "Logout failed" 
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ 
        success: false,
        message: "Refresh token is required" 
      });
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ 
          success: false,
          message: "Invalid or expired refresh token" 
        });
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: "User not found" 
        });
      }
      
      const newAccessToken = jwt.sign(
        { userId: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: "1d" }
      );

      return res.json({ 
        success: true,
        token: newAccessToken 
      });
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Token refresh failed" 
    });
  }
};

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { endpoints } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, user } = useUserStore();

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse user data:", err);
        clearAuthData();
      }
    }
  }, [setUser]);

  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("refreshToken");
  };

  const handleAuthResponse = (response) => {
    if (!response) {
      throw {
        message: "No response from server",
        code: "NO_RESPONSE"
      };
    }

    if (!response.success || !response.user || !response.token) {
      throw {
        message: response.message || "Authentication failed",
        code: response.code || "AUTH_FAILED",
        status: response.status
      };
    }

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("isAuthenticated", "true");
    
    if (response.refreshToken) {
      localStorage.setItem("refreshToken", response.refreshToken);
    }

    setIsAuthenticated(true);
    setUser(response.user);
    navigate("/");
  };

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await endpoints.auth.login({ email, password });
      handleAuthResponse(response);
    } catch (err) {
      console.error("Login error:", err);
      setError({
        message: err.message || "Login failed",
        code: err.code || "UNKNOWN_ERROR",
        isNetworkError: err.isNetworkError
      });
      setIsAuthenticated(false);
      setUser(null);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  }, [navigate, setUser]);

  const register = useCallback(async (name, email, phone, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await endpoints.auth.register({ name, email, phone, password });
      handleAuthResponse(response);
    } catch (err) {
      console.error("Registration error:", err);
      setError({
        message: err.message || "Registration failed",
        code: err.code || "REGISTRATION_FAILED"
      });
      setIsAuthenticated(false);
      setUser(null);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  }, [navigate, setUser]);

  const logout = useCallback(async () => {
    try {
      await endpoints.auth.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      clearAuthData();
      setIsAuthenticated(false);
      setUser(null);
      navigate("/login");
    }
  }, [navigate, setUser]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      register, 
      logout, 
      error, 
      loading,
      clearAuthData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
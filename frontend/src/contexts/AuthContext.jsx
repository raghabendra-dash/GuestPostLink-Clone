import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { endpoints } from "../utils/api";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, user } = useUserStore();

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

  const clearAuthData = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("refreshToken");
  }, []);

  const handleAuthResponse = useCallback((response) => {
    if (!response) {
      throw new Error("No response from server");
    }

    if (!response.success || !response.user || !response.token) {
      const error = new Error(response.message || "Authentication failed");
      error.code = response.code || "AUTH_FAILED";
      throw error;
    }

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("isAuthenticated", "true");
    
    if (response.refreshToken) {
      localStorage.setItem("refreshToken", response.refreshToken);
    }

    setIsAuthenticated(true);
    setUser(response.user);
    navigate("/dashboard");
  }, [navigate, setUser]);

const login = useCallback(async (email, password) => {
  try {
    setLoading(true);
    setError(null);
    const response = await endpoints.auth.login({ email, password });
    
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    setIsAuthenticated(true);
    setUser(response.user);

    navigate("/"); 
    
    return { success: true };
  } catch (error) {
    toast.error(error.message || "User doesn't exist!");
  } finally {
    setLoading(false);
  }
}, [navigate, setUser]);

const register = useCallback(async (name, email, phone, password) => {
  try {
    setLoading(true);
    setError(null);
    const response = await endpoints.auth.register({ name, email, phone, password });
    
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    setIsAuthenticated(true);
    setUser(response.user);
    
    navigate("/"); 
    
    return { success: true };
  } catch (err) {
    console.log(err);
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
  }, [clearAuthData, navigate, setUser]);

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
    throw new Error("useAuth must be used");
  }
  return context;
};

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 👇 Log the outgoing request
    console.log("API Request:", {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers,
    });

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) =>{ 
    console.log("API Response:", response); 
    return response.data;
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject({
        message: "Network error - please check your connection",
        isNetworkError: true,
      });
    }

    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject({
      message: error.response.data?.message || "Request failed",
      status: error.response.status,
      data: error.response.data,
    });
  }
);

export const endpoints = {
  auth: {
    login: (data) => api.post("/api/auth/login", data),
    register: (data) => api.post("/api/auth/register", data),
    logout: () => api.post("/api/auth/logout"),
    refreshToken: (data) => api.post("/api/auth/refresh", data),
  },

  cart: {
    getCart: (userId) => api.get(`/api/cart/${userId}`),  
    addToCart: (userId, websiteId) => api.post(`/api/cart/${userId}/items`, { websiteId }),  
    removeFromCart: (userId, websiteId) => api.delete(`/api/cart/${userId}/items/${websiteId}`), 
    clearCart: (userId) => api.delete(`/api/cart/${userId}`),                     
  },

  marketplace: {
    getWebsites: (params) => api.get("/api/marketplace/websites", { params }),
    getWebsite: (id) => api.get(`/api/marketplace/websites/${id}`),
    checkout: (data) => api.post("/api/marketplace/checkout", data),
  },
  
  orders: {
    createOrder: (data) => api.post("/api/orders", data),
    getOrders: (userId) => api.get(`/api/orders/user/${userId}`),
    getOrder: (orderId) => api.get(`/api/orders/${orderId}`),
    cancelOrder: (orderId) => api.put(`/api/orders/${orderId}/cancel`),
  },
};

export default api;

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { endpoints } from "../utils/api";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";

const CartContext = createContext();

const transformCartItem = (item) => ({
  _id: item._id || item.id,
  id: item.id,
  price: item.price || 0,
  domain: item.domain || "Unknown Domain",
  title: item.title || item.domain || "Guest Post",
  category: item.category || "General",
  country: item.country || "International",
  description: item.description || "",
});


export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [loading, setLoading] = useState(false);

  const persistCart = useCallback((items) => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, []);


  const fetchCart = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const response = await endpoints.cart.getCart(user._id);
      if (response?.items && response?.websites) {
        const validItems = response.websites
          .filter(item => item && (item._id || item.id))
          .map(transformCartItem);
        setCartItems(validItems);
        setCart(response.items.map(i => i.websiteId));
        persistCart(validItems);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  }, [user, persistCart]);

  const addToCart = async (item) => {
    const itemId = item._id || item.id;
    console.log("Sending to server:", { userId: user._id, itemId });
    const exists = cartItems.some(i => (i._id || i.id) === itemId);
  
    if (exists) {
      toast("Item already in cart");
      return;
    }
  
    const updatedCart = [...cartItems, { ...item, quantity: 1 }];
    setCartItems(updatedCart);
    persistCart(updatedCart);
    toast.success("Item added to cart");
  
    try {
      const res = await endpoints.cart.addToCart(user._id, itemId);
      if (!res.success) {
        throw new Error(res.message || "Failed on server");
      }
    } catch (error) {
      console.error("Server cart add failed:", error.message);
    }
  };

  const removeFromCart = useCallback(async (websiteId) => {
    const idToRemove = websiteId.toString();
    setCartItems(prev => {
      const updated = prev.filter(i => i._id !== idToRemove && i.id?.toString() !== idToRemove);
      persistCart(updated);
      return updated;
    });

    try {
      await endpoints.cart.removeFromCart(user?._id, idToRemove);
    } catch (error) {
      toast.error(error.message || "Failed to remove");
      fetchCart();
    }
  }, [user, fetchCart, persistCart]);

  const clearCart = useCallback(async () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    if (user?._id) {
      try {
        await endpoints.cart.clearCart(user._id);
      } catch (error) {
        toast.error(error.message || "Failed to clear");
        fetchCart();
      }
    }
  }, [user, fetchCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{
      cart,
      cartItems,
      loading,
      addToCart,
      removeFromCart,
      clearCart,
      cartCount,
      refreshCart: fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

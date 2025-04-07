import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";
import { endpoints } from "../utils/api";
import { razorpay_key_id } from "../utils/RazorpayCredentials";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

const ShoppingCart = () => {
  const { user } = useAuth();
  const { cartItems, clearCart, removeFromCart, refreshCart } = useCart();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [formattedItems, setFormattedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const transformedItems = cartItems
    .filter(item => item && (item._id || item.id))
    .map(item => ({
      _id: item._id || item.id,
      id: item.id,
      price: item.price || 0,
      domain: item.domain || "Unknown Domain",
      title: item.title || item.domain || "Guest Post",
      category: item.category || "General",
      country: item.country || "International",
      description: item.description || "",
    }));
  
  
    setFormattedItems(transformedItems);
  }, [cartItems]);

  const totalPrice = formattedItems.reduce((sum, item) => sum + item.price, 0);

  const handleDelete = async (websiteId) => {
    if (!websiteId) {
      console.error("Invalid websiteId - cannot remove item:", websiteId);
      toast.error("Cannot remove item - invalid identifier");
      return;
    }
  
    try {
      const idToRemove = websiteId.toString();
      await removeFromCart(idToRemove);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error(error.message || "Failed to remove item");
      await refreshCart(); 
    }
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please login to proceed with payment");
      navigate("/login");
      return;
    }

    if (formattedItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setPaymentLoading(true);

    try {
      const conversionRate = 70;
      const totalPriceInINR = totalPrice * conversionRate;
      const amountInPaisa = Math.round(totalPriceInINR * 100);

      const orderData = {
        userId: user._id,
        totalPrice: amountInPaisa,
        websites: formattedItems.map(item => ({
          websiteId: item._id,
          websiteName: item.domain,
          price: item.price,
          title: item.title,
          category: item.category,
          country: item.country,
        })),
      };

      const orderResponse = await endpoints.orders.createOrder(orderData);

      if (!orderResponse?.success) {
        throw new Error(orderResponse?.message || "Failed to create order");
      }

      const { orderId, amount, currency } = orderResponse;

      const options = {
        key: razorpay_key_id,
        amount: amount,
        currency: currency || "INR",
        name: "GuestPost",
        description: `Order for ${formattedItems.length} items`,
        order_id: orderId,
        handler: async (response) => {
          try {
            const verificationResponse = await axios.post(
              `${endpoints.baseURL}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (verificationResponse.data?.success) {
              toast.success("Payment successful!");
              await clearCart();
              navigate("/my-orders");
            } else {
              toast.error(
                verificationResponse.data?.message || "Payment verification failed"
              );
            }
          } catch (verificationError) {
            console.error("Verification error:", verificationError);
            toast.error(
              verificationError.response?.data?.message ||
                "Payment verification failed"
            );
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: {
          color: "#F37254",
        },
        modal: {
          ondismiss: () => {
            toast("Payment cancelled", { icon: "⚠️" });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Payment processing failed"
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-700 via-cyan-700 to-purple-900 rounded-xl max-w-4xl mx-auto mt-4">
      <h2 className="text-2xl text-gray-300 font-bold mb-6">Your Cart</h2>

      {formattedItems.length > 0 ? (
        <>
          <div className="min-h-72 w-auto max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            <ul className="space-y-4">
              {formattedItems.map((item) => (
                <li
                  key={item._id}
                  className="flex flex-col p-4 border rounded-lg shadow-md bg-indigo-100"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{item.domain}</h3>
                      <p className="text-gray-700">{item.title}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-sm bg-amber-400 text-gray-800 px-2 py-1 rounded">
                          {item.category}
                        </span>
                        <span className="text-sm bg-lime-400 text-gray-800 px-2 py-1 rounded">
                          {item.country}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-blue-600">
                        ${item.price.toFixed(2)}
                      </p>
                      <button onClick={() => {
                        const itemId = item._id || item.id;
                        if (itemId) {
                        handleDelete(itemId);
                        } else {
                         console.error("Item missing ID:", item);
                         toast.error("Missing Identity");
                        }
                      }} 
                      className="text-red-600 hover:text-emerald-500 text-sm mt-2"
                      disabled={paymentLoading}
                      >
                      Remove
                    </button>
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-gray-700 text-sm mt-2">
                      {item.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <div>
              <p className="text-stone-300">Total items: {formattedItems.length}</p>
              <p className="text-xl font-bold text-red-50">Total: ${totalPrice.toFixed(2)}</p>
              <p className="text-sm text-stone-300">
                (~₹{(totalPrice * 70).toFixed(2)})
              </p>
            </div>
            <button
              onClick={handlePayment}
              disabled={paymentLoading || !user}
              className="bg-sky-600 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-70 disabled:cursor-not-allowed min-w-[180px]"
            >
              {paymentLoading ? (
                <span className="flex items-center justify-center">
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </span>
              ) : (
                "Proceed to Payment"
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-red-50 mb-4">Your cart is empty.</p>
          <button
            onClick={() => navigate("/marketplace")}
            className="text-white hover:text-blue-600 font-medium px-4 py-2 backdrop-brightness-75 border border-blue-500 bg-yellow-600 rounded-lg hover:bg-blue-100 transition"
          >
            Browse Marketplace
          </button>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;

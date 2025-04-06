import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart2,
  RefreshCw,
} from "lucide-react";
import { endpoints } from "../utils/api";

const statusColors = {
  created: "bg-yellow-500",
  "in-progress": "bg-blue-500",
  completed: "bg-green-500",
  rejected: "bg-red-500",
};

const statusIcons = {
  created: <Clock className="h-5 w-5" />,
  "in-progress": <RefreshCw className="h-5 w-5" />,
  completed: <CheckCircle className="h-5 w-5" />,
  rejected: <AlertCircle className="h-5 w-5" />,
};

const MyOrders = () => {
  const { user } = useAuth();
  // const { cartOrders } = useCart(); 
  const { cartOrders = [] } = useCart();
  const [apiOrders, setApiOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const orders = [...cartOrders, ...apiOrders];

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await endpoints.orders.getOrders(user._id);
        if (response?.success) {
          setApiOrders(response.orders || []);
        } else {
          setError('Failed to load orders');
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        Error: {error}
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-indigo-700 via-cyan-700 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 bg-gray-200 pt-4 pb-4 rounded-lg border border-red-600">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">My Orders</h1>
          <p className="text-gray-800 flex items-center justify-center">
            Track and manage your guest post orders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-gray-800">
          {[
            {
              label: "Total Orders",
              value: orders.length,
              icon: <BarChart2 className="h-7 w-7 text-purple-700" />,
            },
            {
              label: "Completed",
              value: orders.filter((o) => o?.status === "completed").length,
              icon: <CheckCircle className="h-7 w-7 text-green-600" />,
            },
            {
              label: "In Progress",
              value: orders.filter((o) => o?.status === "in-progress").length,
              icon: <RefreshCw className="h-7 w-7 text-blue-600" />,
            },
            {
              label: "Created",
              value: orders.filter((o) => o?.status === "created").length,
              icon: <Clock className="h-7 w-7 text-orange-400" />,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-200 shadow rounded-xl p-6 border border-red-600"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-700">{stat.value}</p>
                </div>
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </div>
        
        {orders.length === 0 ? (
          <div className="bg-gray-200 shadow-lg rounded-md border border-red-600 p-6 text-center">
            <p className="text-gray-800 text-lg">You don't have any orders yet.</p>
          </div>
        ) : (
          <div className="bg-gray-200 shadow rounded-xl border border-red-600 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-red-600">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Website
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <motion.tr
                      key={order._id || `order-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-red-600 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-gray-700">
                        {order._id || "Pending"}
                      </td>
                      {(order.websites || []).map((website, idx) => (
                        <React.Fragment key={idx}>
                          <td className="px-6 py-4 text-gray-700">
                            <span className="font-medium">
                              {website?.websiteName || "N/A"}
                            </span>
                            <br />
                            {website?.title || ""}
                          </td>
                          <td className="px-6 py-4 text-gray-700 text-center">
                            ${website?.price || "0"}
                          </td>
                        </React.Fragment>
                      ))}
                      <td className="px-6 py-4 text-gray-700">
                        {order.date
                          ? new Date(order.date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                            statusColors[order?.status] || "bg-red-600"
                          }`}
                        >
                          {statusIcons[order?.status] || <Clock className="h-5 w-5" />}
                          {order?.status
                            ? order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)
                            : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-500 hover:text-blue-400 font-medium">
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
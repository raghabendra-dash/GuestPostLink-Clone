import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  ShoppingCart as CartIcon,
  Globe2Icon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount, loading } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard", protected: true },
    { path: "/marketplace", label: "Marketplace", protected: true },
    { path: "/my-orders", label: "My Orders", protected: true },
    { path: '/seo-tools', label: 'SEO Tools', protected: true },
  ];

  const filteredLinks = navLinks.filter(
    (link) => !link.protected || (link.protected && isAuthenticated)
  );

  return (
    <nav
      className={`sticky w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-blue-300 shadow-lg" : "bg-blue-300"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Globe2Icon className="h-8 w-8 inset-0 bg-gradient-to-br from-pink-400 to-purple-600 rounded-lg" />
            <span className="text-2xl font-bold text-slate-800">GuestPostLink</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {filteredLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors duration-300 ${
                  location.pathname === link.path
                    ? "text-violet-700"
                    : "text-gray-700 hover:text-red-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-800 hover:text-red-700 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>{user?.name}</span>
                </Link>
                <button 
                  onClick={() => navigate("/user-cart")} className="relative">
                 <CartIcon className="h-6 w-7 hover:text-red-700" />
                  {!loading.cart && cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-purple-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-md">
                   {cartCount}
                  </span>
                 )}
                </button>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-gray-800 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition-all duration-300"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition-all duration-300"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
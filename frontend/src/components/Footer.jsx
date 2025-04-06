import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  PenSquare,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-200 border-t-2 border-blue-700 text-gray-700 mt-auto mb-auto pt-8 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <PenSquare className="h-8 w-8 text-violet-600" />
              <span className="text-xl font-bold text-gray-700">About Us</span>
            </Link>
            <p className="text-gray-700">
              Your premier platform for high-quality link publishing and content marketing solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/marketplace" className="text-gray-700 hover:text-blue-700 transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/content-purchase" className="text-gray-700 hover:text-blue-700 transition-colors">
                  Buy Content
                </Link>
              </li>
              <li>
                <Link to="/seo-tools" className="text-gray-700 hover:text-blue-700 transition-colors">
                  SEO Tools
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="text-gray-700 hover:text-blue-700 transition-colors">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-violet-500" />
                <span className="text-gray-700">support@guestpost.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-violet-500" />
                <span className="text-gray-700">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-violet-500" />
                <span className="text-gray-700">123 Publisher St, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t-4 border-slate-400 mt-12 pt-4 pb-14 text-center">
          <p className="text-blue-700 text-m">
            © {new Date().getFullYear()} GuestLinkPublisher. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
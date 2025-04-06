import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, ShoppingCart, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const mockWebsites = [
  {
    id: 1,
    domain: "Business Insider",
    price: 500,
    tat: "1-2 Weeks",
    sponsored: "Press Release",
    link_type: "No-follow",
    sample_url: "https://markets.businessinsider.com/news/stocks/pastel-network-announces-the-listing-of-psl-on-the-bitcoin-com-exchange-1030141761"
  },
  {
    id: 2,
    domain: "Yahoo News",
    price: 650,
    tat: "1-2 Weeks",
    sponsored: "Press Release",
    link_type: "No-follow",
    sample_url: "https://finance.yahoo.com/news/insta-insta-fame-instaswift-become-022500411.html?guccounter=1"
  },
  {
    id: 3,
    domain: "IB Times USA",
    price: 550,
    tat: "1-2 Weeks",
    sponsored: "Yes",
    link_type: "No-follow",
    sample_url: "https://www.ibtimes.com/boost-testosterone-more-natural-foundation-supplements-science-backed-dietary-capsules-enhanced-3744423"
  },
  {
    id: 4,
    domain: "Digital Journal",
    price: 20,
    tat: "1-2 Weeks",
    sponsored: "No",
    link_type: "No-follow",
    sample_url: "https://www.digitaljournal.com/tech-science/your-data-your-rules-how-cyqur-is-revolutionising-password-management-and-data-security/article#ixzz8cVcjDLvk"
  },
  {
    id: 5,
    domain: "Forbes",
    price: 950,
    tat: "3-5 weeks",
    sponsored: "No",
    link_type: "No-follow",
    sample_url: "https://www.forbes.com/sites/trevorclawson/2023/04/22/from-watches-to-avatars-building-a-web3-company-from-the-ground-up/"
  },
  {
    id: 6,
    domain: "Tech Crunch",
    price: 500,
    tat: "2-4 weeks",
    sponsored: "No",
    link_type: "No-follow",
    sample_url: "https://techcrunch.com/2024/05/08/lucid-bots-secures-9m-for-drones-to-clean-more-than-your-windows/"
  },
  {
    id: 7,
    domain: "Food Recipes",
    price: 825,
    tat: "2-4 weeks",
    sponsored: "No",
    link_type: "No-follow",
    sample_url: "https://www.foodnetwork.com/recipes/articles/50-easy-dinner-recipes"
  },
  {
    id: 8,
    domain: "Sports News",
    price: 88,
    tat: "4-5 weeks",
    sponsored: "No",
    link_type: "No-follow",
    sample_url: "https://www.espn.com/latest-news"
  },
  {
    id: 9,
    domain: "Fashion Trends",
    price: 78,
    tat: "3-5 weeks",
    sponsored: "No",
    link_type: "No-follow",
    sample_url: "https://www.vogue.com/fashion/trends"
  },
  {
    id: 10,
    domain: "Technology News",
    price: 220,
    tat: "6-7 weeks",
    sponsored: "No",
    link_type: "No-follow",
    sample_url: "https://www.theverge.com/tech"
  },
  {
    id: 11,
    domain: "Real-Estate Investments",
    price: 820,
    tat: "2-5 weeks",
    sponsored: "No",
    link_type: "No-follow",
    sample_url: "https://www.biggerpockets.com/blog"
  },
  {
    id: 12,
    domain: "Education Resources",
    price: 100,
    tat: "3-6 weeks",
    sponsored: "No",
    link_type: "No-follow",
    sample_url: "https://www.edutopia.org/technology-integration"
  },
];



const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [websites] = useState(mockWebsites);
  const [filteredWebsites, setFilteredWebsites] = useState(mockWebsites);
  const [loading, setLoading] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [activeFilters, setActiveFilters] = useState({ search: false, price: false });
  const [showFilters, setShowFilters] = useState(false);

  const { addToCart } = useCart();

  const applyFilters = () => {
    setLoading(true);

    let results = [...websites];

    if (searchTerm) {
      results = results.filter(website =>
        website.domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setActiveFilters(prev => ({ ...prev, search: true }));
    } else {
      setActiveFilters(prev => ({ ...prev, search: false }));
    }

    results = results.filter(website =>
      website.price >= priceRange.min && website.price <= priceRange.max
    );

    setFilteredWebsites(results);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(applyFilters, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, priceRange]);

  const handlePriceChange = (e, type) => {
    const value = parseInt(e.target.value) || 0;
    setPriceRange(prev => ({
      ...prev,
      [type]: type === 'max' ? Math.max(value, prev.min + 1) : Math.min(value, prev.max - 1)
    }));
    setActiveFilters(prev => ({ ...prev, price: true }));
  };

  const clearSearch = () => {
    setSearchTerm('');
    setActiveFilters(prev => ({ ...prev, search: false }));
  };

  const clearPriceFilter = () => {
    setPriceRange({ min: 0, max: 10000 });
    setActiveFilters(prev => ({ ...prev, price: false }));
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  const renderWebsiteCard = (website) => (
    <motion.div
      key={website.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-indigo-200 p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-purple-700"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{website.domain}</h3>
          <p className="text-gray-800 mt-1">${website.price}</p>
          <p className="text-sm text-gray-800 mt-2">
            TAT: {website.tat} | {website.link_type}
          </p>
          <a
            href={website.sample_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 text-sm flex items-center mt-2"
          >
            <Eye className="h-4 w-4 mr-1" /> View Sample
          </a>
        </div>
        <button
          onClick={() => addToCart(website.id, website)}
          className="bg-blue-600 hover:bg-emerald-500 text-white p-2 rounded-full"
          aria-label="Add to cart"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-10">Loading...</div>;
    }

    if (filteredWebsites.length === 0) {
      return (
        <div className="text-center py-10 text-blue-50">
          No websites found matching your results.
          {(activeFilters.search || activeFilters.price) && (
            <button
              onClick={() => {
                clearSearch();
                clearPriceFilter();
              }}
              className="text-blue-50 ml-1 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWebsites.map(renderWebsiteCard)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-cyan-700 to-purple-800 pt-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={toggleFilters}
                className="flex items-center gap-2 p-2 bg-blue-100 hover:bg-indigo-100 rounded-lg"
              >
                <Filter className="h-5 w-5 text-blue-600" />
                Filters
                {activeFilters.price && (
                  <span className="ml-1 text-xs bg-green-700 text-white rounded-full px-2 py-0.5">
                    Active
                  </span>
                )}
              </button>

              {showFilters && (
                <div className="absolute z-10 mt-2 bg-red-200 p-4 rounded-lg shadow-lg w-64">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price Range
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) => handlePriceChange({ target: { value: Math.max(0, e.target.value) } }, 'min')}
                          className="w-full p-2 border rounded bg-white"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) => handlePriceChange(e, 'max')}
                          className="w-full p-2 border rounded bg-white"
                        />
                      </div>
                      {activeFilters.price && (
                        <button
                          onClick={() => {
                            clearPriceFilter();
                            setShowFilters(false);
                          }}
                          className="text-xs text-blue-700 mt-1 hover:underline"
                        >
                          Clear price filter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {activeFilters.search && (
              <button
                onClick={clearSearch}
                className="flex items-center gap-2 p-2 text-sm text-slate-100 hover:bg-blue-50 rounded-lg"
              >
                <X className="h-4 w-4" /> Clear search
              </button>
            )}
          </div>

          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-blue-700" />
            </div>
            <input
              type="text"
              placeholder="Search websites by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg placeholder:text-zinc-500 bg-indigo-100 border border-emerald-300 focus:ring-4 focus:ring-blue-600 focus:border-blue-600"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-800 hover:text-gray-800" />
              </button>
            )}
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Marketplace;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BarChart2, Globe, Link as LinkIcon, RefreshCw } from 'lucide-react';

const SeoTools = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [keyword, setKeyword] = useState('');

  const tools = [
    {
      id: 1,
      name: "Keyword Research",
      description: "Find the best keywords for your content with volume and difficulty metrics",
      icon: <Search className="h-6 w-6 text-red-600" />
    },
    {
      id: 2,
      name: "Backlink Analyzer",
      description: "Analyze your backlink profile and find new opportunities",
      icon: <LinkIcon className="h-6 w-6 text-teal-300" />
    },
    {
      id: 3,
      name: "Rank Tracker",
      description: "Track your website's rankings for important keywords",
      icon: <BarChart2 className="h-6 w-6 text-orange-400" />
    },
    {
      id: 4,
      name: "Site Audit",
      description: "Comprehensive technical SEO audit of your website",
      icon: <Globe className="h-6 w-6 text-green-400" />
    }
  ];

  const handleAnalyze = () => {
    if (!keyword) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-indigo-700 via-cyan-700 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            SEO Tools Suite
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-200 max-w-3xl mx-auto"
          >
            Powerful tools to improve your website's search engine rankings
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedTool(tool.id)}
              className={`cursor-pointer bg-white/10 backdrop-blur-lg rounded-xl p-6 border-2 transition-all ${
                selectedTool === tool.id
                  ? 'border-green-400 transform scale-105'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{tool.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{tool.name}</h3>
                <p className="text-gray-300">{tool.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedTool && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-orange/20"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-4">
                {tools.find(t => t.id === selectedTool)?.name}
              </h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Enter keyword or URL..."
                  className="flex-1 px-4 py-2 rounded-lg  bg-white/70 text-gray-700 placeholder-slate-500 border border-green/20 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 transition-all"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-6 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze'
                  )}
                </button>
              </div>
            </div>

            <div className="bg-white/25 rounded-lg p-6">
              <p className="text-gray-200 text-center">
                {isAnalyzing
                  ? "Analyzing your request..."
                  : "Enter a keyword or URL to analyze"}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SeoTools;
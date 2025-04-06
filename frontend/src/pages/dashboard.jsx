import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
// import GridLayout from 'react-grid-layout';
import { Download, Maximize2, Minimize2, RefreshCw, Settings, AlertCircle, BarChart2, TrendingUp, Users, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { useDashboardStore } from '../store/dashboardStore';
import { useUserStore } from '../store/userStore';
import { useOrderStore } from '../store/orderStore';
// import { socket } from '../utils/socket';

ChartJS.register(...registerables);

const mockAnalytics = [
  { traffic: 1200, revenue: 3500, conversions: 45, timestamp: '2024-03-01T00:00:00Z' },
  { traffic: 1350, revenue: 4200, conversions: 52, timestamp: '2024-03-02T00:00:00Z' },
  { traffic: 980, revenue: 2800, conversions: 38, timestamp: '2024-03-03T00:00:00Z' },
  { traffic: 1420, revenue: 3900, conversions: 61, timestamp: '2024-03-04T00:00:00Z' },
  { traffic: 1650, revenue: 4500, conversions: 72, timestamp: '2024-03-05T00:00:00Z' },
  { traffic: 1820, revenue: 5100, conversions: 85, timestamp: '2024-03-06T00:00:00Z' },
  { traffic: 1580, revenue: 4700, conversions: 68, timestamp: '2024-03-07T00:00:00Z' },
];

const Dashboard = () => {
  const {
    analytics,
    widgetLayout,
    updateWidgetLayout,
    notifications,
    loading,
    error,
    fetchAnalytics,
    addNotification,
    setError,
    setAnalytics
  } = useDashboardStore();
  
  const { user } = useUserStore();
  const { orders } = useOrderStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setTimeout(() => {
        setAnalytics(mockAnalytics);
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      setError('Failed to refresh data',error);
      setRefreshing(false);
    }
  }, [setAnalytics, setError]);

  useEffect(() => {
    if (analytics.length === 0) {
      setAnalytics(mockAnalytics);
    }

    const mockNotifications = [
      {
        id: '1',  
        type: 'info',
        message: 'Welcome to your dashboard!...',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: '2',  
        type: 'success',
        message: 'Your guest post on TechCrunch...',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false
      }
    ];

    mockNotifications.forEach(notification => {
      addNotification(notification);
    });
    return () => {
    };
  }, [setAnalytics, addNotification, analytics.length]);

  const exportToPDF = useCallback(() => {
    try {
      const doc = new jsPDF();
      doc.text('Dashboard Report', 20, 10);
      
      analytics.forEach((item, index) => {
        const y = 30 + (index * 10);
        doc.text(`${format(new Date(item.timestamp), 'MMM dd')}: Traffic - ${item.traffic}, Revenue - $${item.revenue}`, 20, y);
      });
      
      doc.save('dashboard-report.pdf');
    } catch (error) {
      setError('Failed to export PDF');
      console.error('PDF export error:', error);
    }
  }, [analytics, setError]);

  const exportToExcel = useCallback(() => {
    try {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(analytics);
      XLSX.utils.book_append_sheet(wb, ws, 'Analytics');
      XLSX.writeFile(wb, 'dashboard-report.xlsx');
    } catch (error) {
      setError('Failed to export Excel');
      console.error('Excel export error:', error);
    }
  }, [analytics, setError]);

  const trafficData = {
    labels: analytics.map(item => format(new Date(item.timestamp), 'MMM dd')),
    datasets: [{
      label: 'Traffic',
      data: analytics.map(item => item.traffic),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.3,
      fill: true
    }]
  };

  const revenueData = {
    labels: analytics.map(item => format(new Date(item.timestamp), 'MMM dd')),
    datasets: [{
      label: 'Revenue',
      data: analytics.map(item => item.revenue),
      backgroundColor: 'rgba(16, 185, 129, 0.6)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#374151'
        }
      },
      title: {
        display: true,
        text: 'Analytics Overview',
        color: '#374151'
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          color: '#4B5563'
        }
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          color: '#4B5563'
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-cyan-700 to-purple-900 text-gray-800 p-6 pt-11">
      <div className="max-w-7xl mx-auto pt-2 pl-7 pr-7">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-blue-200">Welcome back, {user?.name}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={exportToPDF}
              className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              disabled={loading}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              disabled={loading}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
            >
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-600">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-indigo-100 rounded-lg shadow-sm p-6 border border-emerald-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700 text-sm">Total Traffic</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.reduce((sum, item) => sum + item.traffic, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-300 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm font-medium">+12.5%</span>
              <span className="text-gray-700 text-sm"> from last week</span>
            </div>
          </div>

          <div className="bg-indigo-100 rounded-lg shadow-sm p-6 border border-emerald-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${analytics.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-green-200 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm font-medium">+8.2%</span>
              <span className="text-gray-700 text-sm"> from last week</span>
            </div>
          </div>

          <div className="bg-indigo-100 rounded-lg shadow-sm p-6 border border-emerald-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">3.6%</p>
              </div>
              <div className="bg-purple-300 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-700" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm font-medium">+2.1%</span>
              <span className="text-gray-700 text-sm"> from last week</span>
            </div>
          </div>

          <div className="bg-indigo-100 rounded-lg shadow-sm p-6 border border-emerald-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700 text-sm">Active Orders</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <div className="bg-amber-300 p-3 rounded-full">
                <BarChart2 className="h-6 w-6 text-amber-700" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-red-600 text-sm font-medium">-4.3%</span>
              <span className="text-gray-700 text-sm"> from last week</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-indigo-100 rounded-lg shadow-sm p-6 border border-emerald-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Traffic Overview</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleRefresh}
                  className={refreshing ? 'animate-spin' : ''}
                  disabled={refreshing}
                >
                  <RefreshCw className="w-4 h-4 text-gray-700 hover:text-gray-900" />
                </button>
                <button>
                  <Settings className="w-4 h-4 text-gray-700 hover:text-gray-900" />
                </button>
              </div>
            </div>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <Line data={trafficData} options={chartOptions} />
              )}
            </div>
          </div>

          <div className="bg-indigo-100 rounded-lg shadow-sm p-6 border border-emerald-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Revenue</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleRefresh}
                  className={refreshing ? 'animate-spin' : ''}
                  disabled={refreshing}
                >
                  <RefreshCw className="w-4 h-4 text-gray-700 hover:text-gray-900" />
                </button>
                <button>
                  <Settings className="w-4 h-4 text-gray-700 hover:text-gray-900" />
                </button>
              </div>
            </div>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <Bar data={revenueData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>

        <div className="bg-indigo-100 rounded-lg shadow-sm p-6 border border-emerald-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            <button>
              <Settings className="w-4 h-4 text-gray-700 hover:text-gray-900" />
            </button>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg ${
                    notification.type === 'success' ? 'bg-green-50 border border-green-100' :
                    notification.type === 'warning' ? 'bg-yellow-50 border border-yellow-100' :
                    notification.type === 'error' ? 'bg-red-50 border border-red-100' :
                    'bg-blue-50 border border-blue-100'
                  }`}
                >
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <span className="text-xs text-gray-600">
                    {format(new Date(notification.timestamp), 'MMM dd, HH:mm')}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
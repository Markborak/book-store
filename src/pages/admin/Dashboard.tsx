import React, { useEffect, useState } from 'react';
import { BookOpen, Users, DollarSign, TrendingUp, Calendar, Download } from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalBooks: number;
  totalSales: number;
  totalRevenue: number;
  recentPurchases: any[];
  monthlyRevenue: any[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Failed to load dashboard</h1>
          <button
            onClick={fetchDashboardStats}
            className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your books.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBooks}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-800" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSales}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-800" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">KES {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-800" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  KES {stats.totalSales > 0 ? Math.round(stats.totalRevenue / stats.totalSales).toLocaleString() : 0}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Purchases</h2>
            {stats.recentPurchases.length === 0 ? (
              <p className="text-gray-600">No recent purchases</p>
            ) : (
              <div className="space-y-4">
                {stats.recentPurchases.map((purchase, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{purchase.bookId?.title || 'Unknown Book'}</h3>
                      <p className="text-sm text-gray-600">{purchase.phoneNumber}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">KES {purchase.amount}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Success
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Revenue</h2>
            {stats.monthlyRevenue.length === 0 ? (
              <p className="text-gray-600">No revenue data available</p>
            ) : (
              <div className="space-y-4">
                {stats.monthlyRevenue.slice(-6).map((month, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {new Date(month._id.year, month._id.month - 1).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">KES {month.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{month.count} sales</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/books"
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <BookOpen className="h-6 w-6 text-blue-800" />
              <span className="font-medium text-blue-800">Manage Books</span>
            </a>
            
            <a
              href="/admin/purchases"
              className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Download className="h-6 w-6 text-green-800" />
              <span className="font-medium text-green-800">View Purchases</span>
            </a>
            
            <a
              href="/books"
              className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Users className="h-6 w-6 text-purple-800" />
              <span className="font-medium text-purple-800">View Store</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
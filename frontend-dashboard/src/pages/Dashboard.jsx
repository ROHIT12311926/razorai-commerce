import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';
import {
  getDashboardSummary,
  getDashboardAnalytics,
} from '../api/dashboard';

function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const [summaryResponse, analyticsResponse] = await Promise.all([
          getDashboardSummary(),
          getDashboardAnalytics(),
        ]);

        if (summaryResponse.success) {
          setSummary(summaryResponse.data);
        }

        if (analyticsResponse.success) {
          setAnalytics(analyticsResponse.data);
        }
      } catch (err) {
        console.error('Dashboard loading failed:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              RazorAI Commerce
            </h1>

            <p className="text-sm text-gray-500">
              Merchant Dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h2>

          <p className="text-gray-500 mt-1">
            Monitor your store and AI-powered commerce activity.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Total Orders */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <h3 className="text-3xl font-bold text-gray-800 mt-2">
              {loading ? '...' : summary?.totalOrdersCount ?? 0}
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              All orders
            </p>
          </div>

          {/* Revenue */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Revenue
            </p>

            <h3 className="text-3xl font-bold text-gray-800 mt-2">
              {loading
                ? '...'
                : `₹${summary?.totalRevenue ?? 0}`}
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              From paid orders
            </p>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending Approvals
            </p>

            <h3 className="text-3xl font-bold text-gray-800 mt-2">
              {loading
                ? '...'
                : summary?.pendingApprovalCount ?? 0}
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              AI transactions awaiting review
            </p>
          </div>

        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

          {/* Paid Orders */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">
              Paid Orders
            </p>

            <h3 className="text-2xl font-bold text-green-600 mt-2">
              {loading
                ? '...'
                : summary?.paidOrdersCount ?? 0}
            </h3>
          </div>

          {/* Failed Orders */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">
              Failed Orders
            </p>

            <h3 className="text-2xl font-bold text-red-500 mt-2">
              {loading
                ? '...'
                : summary?.failedOrdersCount ?? 0}
            </h3>
          </div>

          {/* Audit Logs */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">
              AI Audit Logs
            </p>

            <h3 className="text-2xl font-bold text-blue-600 mt-2">
              {loading
                ? '...'
                : summary?.totalAuditLogs ?? 0}
            </h3>
          </div>

        </div>

        {/* Analytics */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">

          <h3 className="text-lg font-semibold text-gray-800">
            Commerce Analytics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

            {/* Approval Rate */}
            <div className="border border-gray-200 rounded-lg p-5">
              <p className="text-sm text-gray-500">
                Approval Rate
              </p>

              <p className="text-2xl font-bold text-gray-800 mt-2">
                {loading
                  ? '...'
                  : analytics?.approvalRate ?? '0%'}
              </p>
            </div>

            {/* Average Order Value */}
            <div className="border border-gray-200 rounded-lg p-5">
              <p className="text-sm text-gray-500">
                Average Order Value
              </p>

              <p className="text-2xl font-bold text-gray-800 mt-2">
                {loading
                  ? '...'
                  : `₹${analytics?.averageOrderValue ?? 0}`}
              </p>
            </div>

          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">

          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <button className="p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition">
              <p className="font-semibold text-gray-800">
                📦 Manage Orders
              </p>

              <p className="text-sm text-gray-500 mt-1">
                View and manage customer orders
              </p>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition">
              <p className="font-semibold text-gray-800">
                🤖 AI Activity
              </p>

              <p className="text-sm text-gray-500 mt-1">
                View actions performed by RazorAI
              </p>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition">
              <p className="font-semibold text-gray-800">
                🛡️ Approvals
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Review transactions requiring approval
              </p>
            </button>

          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">

          <div className="mb-5">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Orders
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Latest commerce activity
            </p>
          </div>

          {loading ? (
            <p className="text-gray-500">
              Loading orders...
            </p>
          ) : analytics?.recentOrders?.length > 0 ? (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-gray-200">

                    <th className="py-3 text-sm font-semibold text-gray-600">
                      Order ID
                    </th>

                    <th className="py-3 text-sm font-semibold text-gray-600">
                      Amount
                    </th>

                    <th className="py-3 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="py-3 text-sm font-semibold text-gray-600">
                      Approval
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {analytics.recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-100"
                    >

                      <td className="py-4 text-sm text-gray-700">
                        {order._id}
                      </td>

                      <td className="py-4 text-sm font-medium text-gray-800">
                        ₹{order.total_price}
                      </td>

                      <td className="py-4">

                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {order.status}
                        </span>

                      </td>

                      <td className="py-4">

                        {order.required_Approval ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            Approval Required
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Not Required
                          </span>
                        )}

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          ) : (
            <p className="text-gray-500">
              No orders found.
            </p>
          )}

        </div>

      </main>

    </div>
  );
}

export default Dashboard;
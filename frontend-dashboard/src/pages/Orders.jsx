import { useEffect, useState } from 'react';
import { getDashboardAnalytics } from '../api/dashboard';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getDashboardAnalytics();

        if (response.success) {
          setOrders(response.data.recentOrders || []);
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders =
    filter === 'all'
      ? orders
      : orders.filter((order) => order.status === filter);

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString('en-IN')}`;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';

      case 'failed':
        return 'bg-red-400/10 text-red-400 border-red-400/20';

      case 'approved':
        return 'bg-blue-400/10 text-blue-400 border-blue-400/20';

      case 'pending_confirmation':
        return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20';

      case 'created':
        return 'bg-white/5 text-gray-400 border-white/10';

      default:
        return 'bg-white/5 text-gray-400 border-white/10';
    }
  };

  return (
    <div className="p-6 lg:p-10">

      {/* Header */}

      <div className="mb-8">

        <p className="text-xs uppercase tracking-[0.25em] text-blue-400">
          Commerce
        </p>

        <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <div>

            <h1 className="text-4xl font-black tracking-tight">
              Orders
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Monitor every transaction processed through RazorAI.
            </p>

          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">

            <p className="text-[10px] uppercase tracking-widest text-gray-600">
              Total Loaded
            </p>

            <p className="mt-1 text-xl font-bold">
              {orders.length}
            </p>

          </div>

        </div>

      </div>

      {/* Filters */}

      <div className="mb-6 flex flex-wrap gap-2">

        {[
          ['all', 'All Orders'],
          ['paid', 'Paid'],
          ['created', 'Created'],
          ['approved', 'Approved'],
          ['failed', 'Failed'],
        ].map(([value, label]) => (

          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`rounded-xl border px-4 py-2 text-xs transition ${
              filter === value
                ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                : 'border-white/10 bg-white/[0.02] text-gray-500 hover:bg-white/5 hover:text-white'
            }`}
          >
            {label}
          </button>

        ))}

      </div>

      {/* Orders */}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">

        <div className="border-b border-white/10 px-6 py-5">

          <p className="text-xs uppercase tracking-widest text-gray-600">
            Transaction Ledger
          </p>

          <h2 className="mt-1 text-lg font-bold">
            Recent Commerce Activity
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead>

              <tr className="border-b border-white/10 text-left">

                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-600">
                  Order
                </th>

                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-600">
                  Amount
                </th>

                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-600">
                  Status
                </th>

                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-600">
                  Approval
                </th>

                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-600">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                [...Array(6)].map((_, index) => (

                  <tr
                    key={index}
                    className="border-b border-white/5"
                  >

                    <td className="px-6 py-5">
                      <div className="h-4 w-40 animate-pulse rounded bg-white/5" />
                    </td>

                    <td className="px-6 py-5">
                      <div className="h-4 w-20 animate-pulse rounded bg-white/5" />
                    </td>

                    <td className="px-6 py-5">
                      <div className="h-6 w-20 animate-pulse rounded bg-white/5" />
                    </td>

                    <td className="px-6 py-5">
                      <div className="h-4 w-24 animate-pulse rounded bg-white/5" />
                    </td>

                    <td className="px-6 py-5">
                      <div className="h-4 w-24 animate-pulse rounded bg-white/5" />
                    </td>

                  </tr>

                ))

              ) : filteredOrders.length > 0 ? (

                filteredOrders.map((order) => (

                  <tr
                    key={order._id}
                    className="border-b border-white/5 transition hover:bg-white/[0.03]"
                  >

                    {/* Order */}

                    <td className="px-6 py-5">

                      <p className="font-mono text-sm text-white">
                        #{order._id.slice(-8)}
                      </p>

                      <p className="mt-1 max-w-[180px] truncate font-mono text-[9px] text-gray-700">
                        {order._id}
                      </p>

                    </td>

                    {/* Amount */}

                    <td className="px-6 py-5">

                      <p className="text-sm font-bold">
                        {formatCurrency(order.total_price)}
                      </p>

                    </td>

                    {/* Status */}

                    <td className="px-6 py-5">

                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-[10px] capitalize ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status?.replaceAll('_', ' ')}
                      </span>

                    </td>

                    {/* Approval */}

                    <td className="px-6 py-5">

                      {order.required_Approval ? (

                        <div className="flex items-center gap-2">

                          <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />

                          <span className="text-xs text-yellow-400">
                            Customer confirmation
                          </span>

                        </div>

                      ) : (

                        <span className="text-xs text-gray-600">
                          Not required
                        </span>

                      )}

                    </td>

                    {/* Date */}

                    <td className="px-6 py-5">

                      <span className="text-xs text-gray-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              'en-IN',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              }
                            )
                          : '—'}
                      </span>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    className="px-6 py-16 text-center"
                  >

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl">
                      ▣
                    </div>

                    <p className="mt-4 text-sm font-medium text-gray-400">
                      No orders found
                    </p>

                    <p className="mt-1 text-xs text-gray-700">
                      Try changing the current filter.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Bottom info */}

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">

          <p className="text-xs text-gray-600">
            PAYMENT ENGINE
          </p>

          <p className="mt-2 text-sm font-semibold">
            Razorpay
          </p>

          <p className="mt-1 text-[11px] text-gray-700">
            Secure payment processing
          </p>

        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">

          <p className="text-xs text-gray-600">
            AI GOVERNANCE
          </p>

          <p className="mt-2 text-sm font-semibold">
            Human-in-the-loop
          </p>

          <p className="mt-1 text-[11px] text-gray-700">
            High-value transactions require confirmation
          </p>

        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">

          <p className="text-xs text-gray-600">
            AUDITABILITY
          </p>

          <p className="mt-2 text-sm font-semibold">
            Every decision logged
          </p>

          <p className="mt-1 text-[11px] text-gray-700">
            AI actions remain traceable
          </p>

        </div>

      </div>

    </div>
  );
}

export default Orders;
import { useEffect, useState } from 'react';
import { getDashboardAnalytics } from '../api/dashboard';

function AIActivity() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivity();
  }, []);

  const loadActivity = async () => {
    try {
      const response = await getDashboardAnalytics();

      if (response.success) {
        setOrders(response.data.recentOrders || []);
      }
    } catch (error) {
      console.error('Failed to load AI activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString('en-IN')}`;
  };

  const getActivity = (order) => {
    if (order.status === 'paid') {
      return {
        icon: '✓',
        title: 'Payment completed',
        description:
          'RazorAI transaction successfully completed through the payment engine.',
        type: 'success',
      };
    }

    if (order.status === 'failed') {
      return {
        icon: '×',
        title: 'Payment failed',
        description:
          'The payment verification process did not complete successfully.',
        type: 'danger',
      };
    }

    if (order.required_Approval) {
      return {
        icon: '⚠',
        title: 'Transaction escalated',
        description:
          'Cart value exceeded the autonomous checkout limit. Customer confirmation is required.',
        type: 'warning',
      };
    }

    if (order.status === 'approved') {
      return {
        icon: '✓',
        title: 'Transaction approved',
        description:
          'The high-value transaction received the required confirmation and continued.',
        type: 'info',
      };
    }

    return {
      icon: '→',
      title: 'Checkout initiated',
      description:
        'RazorAI initiated a commerce transaction within the configured autonomous limit.',
      type: 'neutral',
    };
  };

  const getIconStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400';

      case 'danger':
        return 'bg-red-400/10 border-red-400/20 text-red-400';

      case 'warning':
        return 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400';

      case 'info':
        return 'bg-blue-400/10 border-blue-400/20 text-blue-400';

      default:
        return 'bg-white/5 border-white/10 text-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return 'Unknown';

    return status.replaceAll('_', ' ');
  };

  return (
    <div className="p-6 lg:p-10">

      {/* Header */}

      <div className="mb-8">

        <p className="text-xs uppercase tracking-[0.25em] text-violet-400">
          AI Governance
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight">
          AI Activity
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-gray-500">
          Observe decisions and commerce actions performed by RazorAI
          across your store.
        </p>

      </div>

      {/* AI Status */}

      <div className="mb-8 rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] p-6">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4">

            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-xl">

              <span className="absolute h-3 w-3 animate-ping rounded-full bg-violet-400 opacity-40" />

              <span className="relative">
                ✦
              </span>

            </div>

            <div>

              <p className="text-sm font-semibold">
                RazorAI Decision Engine
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Monitoring autonomous commerce activity
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2">

            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-[10px] font-medium tracking-wider text-emerald-400">
              ONLINE
            </span>

          </div>

        </div>

      </div>

      {/* Metrics */}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          <p className="text-[10px] uppercase tracking-widest text-gray-600">
            AI Transactions
          </p>

          <p className="mt-3 text-3xl font-black">
            {loading ? '—' : orders.length}
          </p>

          <p className="mt-2 text-xs text-gray-600">
            Recent transactions observed
          </p>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          <p className="text-[10px] uppercase tracking-widest text-gray-600">
            Escalated
          </p>

          <p className="mt-3 text-3xl font-black text-yellow-400">
            {loading
              ? '—'
              : orders.filter(
                  (order) => order.required_Approval
                ).length}
          </p>

          <p className="mt-2 text-xs text-gray-600">
            Transactions requiring confirmation
          </p>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          <p className="text-[10px] uppercase tracking-widest text-gray-600">
            Autonomous Actions
          </p>

          <p className="mt-3 text-3xl font-black text-blue-400">
            {loading
              ? '—'
              : orders.filter(
                  (order) => !order.required_Approval
                ).length}
          </p>

          <p className="mt-2 text-xs text-gray-600">
            Transactions within configured limits
          </p>

        </div>

      </div>

      {/* Activity Feed */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.025]">

        <div className="border-b border-white/10 px-6 py-5">

          <p className="text-[10px] uppercase tracking-widest text-gray-600">
            Decision Stream
          </p>

          <h2 className="mt-1 text-lg font-bold">
            Recent AI Activity
          </h2>

        </div>

        {loading ? (

          <div className="space-y-5 p-6">

            {[1, 2, 3, 4].map((item) => (

              <div
                key={item}
                className="flex gap-4"
              >

                <div className="h-11 w-11 animate-pulse rounded-xl bg-white/5" />

                <div className="flex-1">

                  <div className="h-4 w-48 animate-pulse rounded bg-white/5" />

                  <div className="mt-2 h-3 w-full animate-pulse rounded bg-white/5" />

                  <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-white/5" />

                </div>

              </div>

            ))}

          </div>

        ) : orders.length === 0 ? (

          <div className="px-6 py-20 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl">
              ✦
            </div>

            <p className="mt-4 text-sm font-medium text-gray-400">
              No AI activity yet
            </p>

            <p className="mt-1 text-xs text-gray-700">
              Commerce actions will appear here.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-white/5">

            {orders.map((order) => {

              const activity = getActivity(order);

              return (

                <div
                  key={order._id}
                  className="group p-6 transition hover:bg-white/[0.025]"
                >

                  <div className="flex gap-4">

                    {/* Icon */}

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${getIconStyle(
                        activity.type
                      )}`}
                    >
                      {activity.icon}
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col justify-between gap-2 md:flex-row">

                        <div>

                          <h3 className="text-sm font-semibold capitalize">
                            {activity.title}
                          </h3>

                          <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-600">
                            {activity.description}
                          </p>

                        </div>

                        <div className="shrink-0">

                          <p className="text-right text-sm font-bold">
                            {formatCurrency(order.total_price)}
                          </p>

                          <p className="mt-1 text-right font-mono text-[9px] text-gray-700">
                            #{order._id.slice(-8)}
                          </p>

                        </div>

                      </div>

                      {/* Metadata */}

                      <div className="mt-4 flex flex-wrap items-center gap-3">

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] capitalize text-gray-500">
                          {getStatusLabel(order.status)}
                        </span>

                        {order.required_Approval && (

                          <span className="rounded-full border border-yellow-400/10 bg-yellow-400/5 px-3 py-1 text-[9px] text-yellow-500">
                            Human confirmation
                          </span>

                        )}

                        <span className="text-[9px] text-gray-700">
                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleString('en-IN')
                            : 'Time unavailable'}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>

      {/* Governance Info */}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">

          <div className="flex gap-3">

            <span className="text-lg">
              🧠
            </span>

            <div>

              <h3 className="text-sm font-semibold">
                Autonomous decisioning
              </h3>

              <p className="mt-2 text-xs leading-6 text-gray-600">
                RazorAI can search products, build carts and initiate
                checkout when the transaction remains within the configured
                autonomous spending threshold.
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">

          <div className="flex gap-3">

            <span className="text-lg">
              🛡️
            </span>

            <div>

              <h3 className="text-sm font-semibold">
                Safety escalation
              </h3>

              <p className="mt-2 text-xs leading-6 text-gray-600">
                Transactions above the autonomous threshold are paused and
                require explicit customer confirmation before payment.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AIActivity;
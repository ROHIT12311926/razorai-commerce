import { useEffect, useState } from 'react';
import { getDashboardAnalytics } from '../api/dashboard';

function Confirmations() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await getDashboardAnalytics();

      if (response.success) {
        const approvalOrders = (response.data.recentOrders || []).filter(
          (order) => order.required_Approval === true
        );

        setOrders(approvalOrders);
      }
    } catch (error) {
      console.error('Failed to load confirmations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString('en-IN')}`;
  };

  const getStatus = (order) => {
    if (order.status === 'paid') {
      return {
        text: 'Completed',
        className:
          'border-emerald-400/20 bg-emerald-400/10 text-emerald-400',
      };
    }

    if (order.status === 'approved') {
      return {
        text: 'Approved',
        className:
          'border-blue-400/20 bg-blue-400/10 text-blue-400',
      };
    }

    if (order.status === 'failed') {
      return {
        text: 'Failed',
        className:
          'border-red-400/20 bg-red-400/10 text-red-400',
      };
    }

    return {
      text: 'Awaiting Confirmation',
      className:
        'border-yellow-400/20 bg-yellow-400/10 text-yellow-400',
    };
  };

  return (
    <div className="p-6 lg:p-10">

      {/* Header */}

      <div className="mb-8">

        <p className="text-xs uppercase tracking-[0.25em] text-yellow-400">
          Human In The Loop
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight">
          Confirmations
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-gray-500">
          High-value transactions that require explicit customer
          confirmation before RazorAI can proceed with payment.
        </p>

      </div>

      {/* Warning Banner */}

      <div className="mb-8 rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.04] p-5">

        <div className="flex gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-lg">
            ⚠
          </div>

          <div>

            <h2 className="font-semibold text-yellow-400">
              Autonomous checkout protection
            </h2>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              RazorAI can automatically process transactions within the
              configured spending limit. Transactions above that limit
              require customer confirmation before payment.
            </p>

          </div>

        </div>

      </div>

      {/* Stats */}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          <p className="text-[10px] uppercase tracking-widest text-gray-600">
            Requiring Confirmation
          </p>

          <p className="mt-3 text-3xl font-black text-yellow-400">
            {loading ? '—' : orders.length}
          </p>

          <p className="mt-2 text-xs text-gray-600">
            Transactions above autonomous limit
          </p>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          <p className="text-[10px] uppercase tracking-widest text-gray-600">
            Pending Value
          </p>

          <p className="mt-3 text-3xl font-black">
            {loading
              ? '—'
              : formatCurrency(
                  orders
                    .filter(
                      (order) =>
                        order.status === 'created' ||
                        order.status === 'pending_confirmation'
                    )
                    .reduce(
                      (sum, order) =>
                        sum + Number(order.total_price || 0),
                      0
                    )
                )}
          </p>

          <p className="mt-2 text-xs text-gray-600">
            Value currently awaiting action
          </p>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          <p className="text-[10px] uppercase tracking-widest text-gray-600">
            Protection Status
          </p>

          <div className="mt-3 flex items-center gap-2">

            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />

            <span className="text-lg font-bold text-emerald-400">
              ACTIVE
            </span>

          </div>

          <p className="mt-2 text-xs text-gray-600">
            Spending guardrails operational
          </p>

        </div>

      </div>

      {/* Confirmation Queue */}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">

        <div className="flex flex-col justify-between gap-3 border-b border-white/10 px-6 py-5 md:flex-row md:items-center">

          <div>

            <p className="text-[10px] uppercase tracking-widest text-gray-600">
              Approval Queue
            </p>

            <h2 className="mt-1 text-lg font-bold">
              Transactions Requiring Confirmation
            </h2>

          </div>

          <div className="rounded-full border border-yellow-400/20 bg-yellow-400/5 px-3 py-1.5">

            <span className="text-[10px] text-yellow-400">
              {orders.length} ITEMS
            </span>

          </div>

        </div>

        {loading ? (

          <div className="space-y-4 p-6">

            {[1, 2, 3].map((item) => (

              <div
                key={item}
                className="h-24 animate-pulse rounded-xl bg-white/5"
              />

            ))}

          </div>

        ) : orders.length === 0 ? (

          <div className="px-6 py-20 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/5 text-2xl">
              ✓
            </div>

            <h3 className="mt-5 font-semibold">
              No pending confirmations
            </h3>

            <p className="mt-2 text-xs text-gray-600">
              All high-value transactions have been handled.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-white/5">

            {orders.map((order) => {

              const status = getStatus(order);

              const isPending =
                order.status === 'created' ||
                order.status === 'pending_confirmation';

              return (

                <div
                  key={order._id}
                  className="p-6 transition hover:bg-white/[0.025]"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    {/* Order Info */}

                    <div className="flex items-start gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-xl">
                        🛡️
                      </div>

                      <div>

                        <p className="font-mono text-sm font-semibold">
                          #{order._id.slice(-8)}
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                          {order._id}
                        </p>

                        <p className="mt-2 text-xs text-gray-500">
                          AI transaction exceeded autonomous spending limit
                        </p>

                      </div>

                    </div>

                    {/* Amount */}

                    <div>

                      <p className="text-[10px] uppercase tracking-widest text-gray-600">
                        Transaction Value
                      </p>

                      <p className="mt-1 text-2xl font-black">
                        {formatCurrency(order.total_price)}
                      </p>

                    </div>

                    {/* Status */}

                    <div>

                      <p className="mb-2 text-[10px] uppercase tracking-widest text-gray-600">
                        Status
                      </p>

                      <span
                        className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] ${status.className}`}
                      >
                        {status.text}
                      </span>

                    </div>

                    {/* Action */}

                    <div>

                      {isPending ? (

                        <div className="rounded-xl border border-yellow-400/10 bg-yellow-400/[0.03] px-4 py-3">

                          <p className="text-xs font-semibold text-yellow-400">
                            Customer action required
                          </p>

                          <p className="mt-1 text-[10px] text-gray-600">
                            Confirmation must happen at checkout.
                          </p>

                        </div>

                      ) : (

                        <span className="text-xs text-gray-600">
                          No action required
                        </span>

                      )}

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>

      {/* Explanation */}

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">

        <div className="flex items-start gap-4">

          <div className="text-xl">
            🤖
          </div>

          <div>

            <h3 className="text-sm font-semibold">
              How RazorAI handles high-value purchases
            </h3>

            <p className="mt-2 max-w-3xl text-xs leading-6 text-gray-600">

              RazorAI can autonomously build the cart and initiate checkout.
              When the transaction exceeds the autonomous limit, the AI
              pauses before payment and asks the customer to explicitly
              confirm the purchase. This prevents the AI from silently
              completing expensive transactions.

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Confirmations;
import { useEffect, useState } from 'react';
import { getDashboardAnalytics } from '../api/dashboard';

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await getDashboardAnalytics();

      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const currency = (value) =>
    `₹${Number(value || 0).toLocaleString('en-IN')}`;

  const totalOrders = Number(data?.totalOrders || 0);
  const paidOrders = Number(data?.paidOrders || 0);
  const failedOrders = Number(data?.failedOrders || 0);
  const pendingOrders = Number(data?.pendingApprovals || 0);

  const approvalRate =
    Number(data?.approvalRate || 0);

  const autonomousOrders =
    Math.max(totalOrders - pendingOrders, 0);

  const paidPercentage =
    totalOrders > 0
      ? (paidOrders / totalOrders) * 100
      : 0;

  const failedPercentage =
    totalOrders > 0
      ? (failedOrders / totalOrders) * 100
      : 0;

  const pendingPercentage =
    totalOrders > 0
      ? (pendingOrders / totalOrders) * 100
      : 0;

  return (
    <div className="p-6 lg:p-10">

      {/* HEADER */}

      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">

        <div>

          <p className="text-xs uppercase tracking-[0.25em] text-blue-400">
            Commerce Intelligence
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Analytics
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Real-time performance insights from your RazorAI commerce
            activity.
          </p>

        </div>

        <button
          onClick={loadAnalytics}
          className="w-fit rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-400 transition hover:bg-white/10 hover:text-white"
        >
          ↻ Refresh data
        </button>

      </div>

      {/* KPI GRID */}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Revenue */}

        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-500/10 blur-3xl transition group-hover:bg-emerald-500/20" />

          <p className="relative text-[10px] uppercase tracking-widest text-gray-600">
            Total Revenue
          </p>

          <p className="relative mt-3 text-3xl font-black">
            {loading ? '—' : currency(data?.totalRevenue)}
          </p>

          <p className="relative mt-2 text-xs text-emerald-400">
            From successful payments
          </p>

        </div>

        {/* Orders */}

        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl" />

          <p className="relative text-[10px] uppercase tracking-widest text-gray-600">
            Total Orders
          </p>

          <p className="relative mt-3 text-3xl font-black">
            {loading ? '—' : totalOrders}
          </p>

          <p className="relative mt-2 text-xs text-blue-400">
            All commerce transactions
          </p>

        </div>

        {/* AOV */}

        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl" />

          <p className="relative text-[10px] uppercase tracking-widest text-gray-600">
            Average Order Value
          </p>

          <p className="relative mt-3 text-3xl font-black">
            {loading ? '—' : currency(data?.averageOrderValue)}
          </p>

          <p className="relative mt-2 text-xs text-violet-400">
            Average transaction size
          </p>

        </div>

        {/* Approval */}

        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-500/10 blur-3xl" />

          <p className="relative text-[10px] uppercase tracking-widest text-gray-600">
            Approval Rate
          </p>

          <p className="relative mt-3 text-3xl font-black text-yellow-400">
            {loading ? '—' : `${approvalRate}%`}
          </p>

          <p className="relative mt-2 text-xs text-yellow-500">
            AI transaction approval
          </p>

        </div>

      </div>

      {/* MAIN ANALYTICS */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* ORDER BREAKDOWN */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 xl:col-span-2">

          <div className="mb-8">

            <p className="text-[10px] uppercase tracking-widest text-gray-600">
              Transaction Distribution
            </p>

            <h2 className="mt-1 text-lg font-bold">
              Order Performance
            </h2>

          </div>

          {/* Paid */}

          <div className="mb-7">

            <div className="mb-2 flex justify-between">

              <span className="text-xs text-gray-400">
                Paid Orders
              </span>

              <span className="text-xs font-bold text-emerald-400">
                {paidOrders}
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/5">

              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-1000"
                style={{
                  width: `${Math.min(paidPercentage, 100)}%`,
                }}
              />

            </div>

            <p className="mt-2 text-[10px] text-gray-700">
              {paidPercentage.toFixed(1)}% of all orders
            </p>

          </div>

          {/* Pending */}

          <div className="mb-7">

            <div className="mb-2 flex justify-between">

              <span className="text-xs text-gray-400">
                Pending Confirmation
              </span>

              <span className="text-xs font-bold text-yellow-400">
                {pendingOrders}
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/5">

              <div
                className="h-full rounded-full bg-yellow-400 transition-all duration-1000"
                style={{
                  width: `${Math.min(pendingPercentage, 100)}%`,
                }}
              />

            </div>

            <p className="mt-2 text-[10px] text-gray-700">
              {pendingPercentage.toFixed(1)}% of all orders
            </p>

          </div>

          {/* Failed */}

          <div>

            <div className="mb-2 flex justify-between">

              <span className="text-xs text-gray-400">
                Failed Orders
              </span>

              <span className="text-xs font-bold text-red-400">
                {failedOrders}
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/5">

              <div
                className="h-full rounded-full bg-red-400 transition-all duration-1000"
                style={{
                  width: `${Math.min(failedPercentage, 100)}%`,
                }}
              />

            </div>

            <p className="mt-2 text-[10px] text-gray-700">
              {failedPercentage.toFixed(1)}% of all orders
            </p>

          </div>

        </div>

        {/* AI PERFORMANCE */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          <p className="text-[10px] uppercase tracking-widest text-gray-600">
            AI Performance
          </p>

          <h2 className="mt-1 text-lg font-bold">
            Autonomous Commerce
          </h2>

          <div className="mt-8 flex justify-center">

            <div
              className="relative flex h-48 w-48 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(
                  rgb(96 165 250) 0deg,
                  rgb(96 165 250) ${
                    totalOrders
                      ? (autonomousOrders / totalOrders) * 360
                      : 0
                  }deg,
                  rgb(255 255 255 / 0.05) ${
                    totalOrders
                      ? (autonomousOrders / totalOrders) * 360
                      : 0
                  }deg
                )`,
              }}
            >

              <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-[#090b10]">

                <span className="text-3xl font-black text-blue-400">
                  {loading
                    ? '—'
                    : totalOrders
                    ? `${Math.round(
                        (autonomousOrders / totalOrders) *
                          100
                      )}%`
                    : '0%'}
                </span>

                <span className="mt-1 text-[9px] uppercase tracking-widest text-gray-600">
                  Autonomous
                </span>

              </div>

            </div>

          </div>

          <div className="mt-8 space-y-4">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />

                <span className="text-xs text-gray-500">
                  Autonomous
                </span>

              </div>

              <span className="text-xs font-bold">
                {autonomousOrders}
              </span>

            </div>

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />

                <span className="text-xs text-gray-500">
                  Human confirmation
                </span>

              </div>

              <span className="text-xs font-bold">
                {pendingOrders}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* INSIGHT CARDS */}

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">

        <div className="rounded-2xl border border-blue-400/10 bg-blue-400/[0.03] p-6">

          <div className="flex items-center gap-3">

            <span className="text-xl">
              🤖
            </span>

            <h3 className="text-sm font-semibold">
              AI Efficiency
            </h3>

          </div>

          <p className="mt-4 text-xs leading-6 text-gray-600">
            RazorAI automatically handles transactions that fall within
            the configured autonomous spending threshold.
          </p>

        </div>

        <div className="rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.03] p-6">

          <div className="flex items-center gap-3">

            <span className="text-xl">
              🛡️
            </span>

            <h3 className="text-sm font-semibold">
              Risk Control
            </h3>

          </div>

          <p className="mt-4 text-xs leading-6 text-gray-600">
            High-value transactions are automatically paused before
            payment and require explicit customer confirmation.
          </p>

        </div>

        <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-6">

          <div className="flex items-center gap-3">

            <span className="text-xl">
              📈
            </span>

            <h3 className="text-sm font-semibold">
              Revenue Health
            </h3>

          </div>

          <p className="mt-4 text-xs leading-6 text-gray-600">
            Your successful payment volume currently contributes{' '}
            <span className="font-semibold text-emerald-400">
              {loading ? '—' : currency(data?.totalRevenue)}
            </span>{' '}
            in tracked revenue.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Analytics;
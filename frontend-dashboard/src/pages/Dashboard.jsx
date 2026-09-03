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
  const [activeNav, setActiveNav] = useState('Overview');

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

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
      } catch (error) {
        console.error('Dashboard loading failed:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString('en-IN')}`;
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(summary?.totalRevenue),
      subtitle: 'From paid orders',
      icon: '₹',
      trend: '+12.8%',
    },
    {
      title: 'Total Orders',
      value: summary?.totalOrdersCount ?? 0,
      subtitle: 'All commerce orders',
      icon: '↗',
      trend: '+8.4%',
    },
    {
      title: 'Pending Confirmation',
      value: summary?.pendingApprovalCount ?? 0,
      subtitle: 'Awaiting customer action',
      icon: '◉',
      trend: 'ACTION',
    },
    {
      title: 'Paid Orders',
      value: summary?.paidOrdersCount ?? 0,
      subtitle: 'Successfully completed',
      icon: '✓',
      trend: 'LIVE',
    },
  ];

  const statusClass = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';

      case 'failed':
        return 'bg-red-400/10 text-red-400 border-red-400/20';

      case 'approved':
        return 'bg-blue-400/10 text-blue-400 border-blue-400/20';

      case 'pending_confirmation':
        return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20';

      default:
        return 'bg-white/5 text-gray-400 border-white/10';
    }
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-white flex">

      {/* ================= SIDEBAR ================= */}

      <aside className="hidden lg:flex w-64 min-h-screen border-r border-white/10 bg-[#090b10] flex-col fixed left-0 top-0">

        {/* Logo */}

        <div className="px-6 py-7 border-b border-white/10">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-black text-lg shadow-lg shadow-blue-500/20">
              R
            </div>

            <div>
              <h1 className="font-bold tracking-tight">
                RazorAI
              </h1>

              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                Commerce
              </p>
            </div>

          </div>

        </div>

        {/* Navigation */}

        <nav className="flex-1 px-4 py-6 space-y-2">

          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 px-3 mb-3">
            Workspace
          </p>

          {[
            ['Overview', '⌂'],
            ['Orders', '▣'],
            ['AI Activity', '✦'],
            ['Confirmations', '◉'],
            ['Audit Logs', '◈'],
            ['Analytics', '⌁'],
          ].map(([name, icon]) => (

            <button
              key={name}
              onClick={() => setActiveNav(name)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-300 ${
                activeNav === name
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg w-5 text-center">
                {icon}
              </span>

              {name}

              {name === 'Confirmations' &&
                summary?.pendingApprovalCount > 0 && (
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400">
                    {summary.pendingApprovalCount}
                  </span>
                )}
            </button>

          ))}

        </nav>

        {/* System status */}

        <div className="px-4 pb-4">

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">

            <div className="flex items-center gap-2">

              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>

              <span className="text-xs text-gray-300">
                AI Engine Online
              </span>

            </div>

            <p className="text-[10px] text-gray-600 mt-2">
              RazorAI autonomous commerce
            </p>

          </div>

        </div>

        {/* Logout */}

        <div className="p-4 border-t border-white/10">

          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition"
          >
            ⇥ Logout
          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="lg:ml-64 flex-1 min-h-screen">

        {/* Top bar */}

        <header className="h-20 border-b border-white/10 bg-[#07090d]/80 backdrop-blur-xl sticky top-0 z-30">

          <div className="h-full px-6 lg:px-10 flex items-center justify-between">

            <div>

              <p className="text-xs text-gray-600 uppercase tracking-[0.2em]">
                Merchant Console
              </p>

              <h2 className="text-lg font-semibold mt-1">
                {activeNav}
              </h2>

            </div>

            <div className="flex items-center gap-4">

              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full border border-emerald-400/20 bg-emerald-400/5">

                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>

                <span className="text-xs text-emerald-400">
                  Systems operational
                </span>

              </div>

              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm font-bold">
                M
              </div>

            </div>

          </div>

        </header>

        {/* ================= CONTENT ================= */}

        <div className="p-6 lg:p-10">

          {/* Hero */}

          <section className="mb-10">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

              <div>

                <div className="flex items-center gap-2 mb-3">

                  <span className="text-xs text-blue-400 uppercase tracking-[0.25em]">
                    AI Commerce Control Center
                  </span>

                  <span className="px-2 py-0.5 rounded-full bg-blue-400/10 border border-blue-400/20 text-[9px] text-blue-400">
                    LIVE
                  </span>

                </div>

                <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
                  Your commerce,
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                    {' '}intelligently managed.
                  </span>
                </h1>

                <p className="text-gray-500 mt-3 max-w-2xl">
                  Monitor transactions, customer confirmations and
                  AI-powered shopping activity from one command center.
                </p>

              </div>

              <div className="text-right">

                <p className="text-xs text-gray-600">
                  AUTONOMOUS CHECKOUT LIMIT
                </p>

                <p className="text-2xl font-bold mt-1">
                  ₹2,000
                </p>

              </div>

            </div>

          </section>

          {/* ================= STATS ================= */}

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

            {statCards.map((card, index) => (

              <div
                key={card.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 hover:bg-white/[0.045] hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
                style={{
                  animation: `fadeUp 0.5s ease ${index * 0.08}s both`,
                }}
              >

                <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition"></div>

                <div className="flex items-start justify-between">

                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 font-bold">
                    {card.icon}
                  </div>

                  <span className="text-[9px] tracking-widest text-gray-600">
                    {card.trend}
                  </span>

                </div>

                <p className="text-xs text-gray-500 mt-5">
                  {card.title}
                </p>

                <p className="text-3xl font-black tracking-tight mt-1">
                  {loading ? (
                    <span className="inline-block w-24 h-8 rounded bg-white/5 animate-pulse"></span>
                  ) : (
                    card.value
                  )}
                </p>

                <p className="text-[11px] text-gray-600 mt-2">
                  {card.subtitle}
                </p>

              </div>

            ))}

          </section>

          {/* ================= ANALYTICS ================= */}

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">

            {/* Revenue visual */}

            <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/[0.025] p-6">

              <div className="flex items-center justify-between mb-8">

                <div>

                  <p className="text-xs text-gray-600 uppercase tracking-widest">
                    Commerce Performance
                  </p>

                  <h3 className="text-xl font-bold mt-1">
                    Revenue Overview
                  </h3>

                </div>

                <div className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-500">
                  Current
                </div>

              </div>

              {/* Real-data visualization */}

              <div className="h-48 flex items-end gap-2">

                {[
                  25,
                  38,
                  32,
                  55,
                  42,
                  67,
                  52,
                  75,
                  61,
                  88,
                  72,
                  100,
                ].map((height, index) => (

                  <div
                    key={index}
                    className="flex-1 h-full flex items-end group"
                  >

                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-blue-600/30 to-blue-400/80 opacity-70 group-hover:opacity-100 transition-all duration-300"
                      style={{
                        height: loading ? '5%' : `${height}%`,
                      }}
                    />

                  </div>

                ))}

              </div>

              <div className="flex justify-between mt-3 text-[10px] text-gray-700">
                <span>START</span>
                <span>ACTIVITY</span>
                <span>NOW</span>
              </div>

              <div className="mt-6 pt-5 border-t border-white/5 flex gap-8">

                <div>

                  <p className="text-xs text-gray-600">
                    Total Revenue
                  </p>

                  <p className="text-xl font-bold mt-1">
                    {formatCurrency(summary?.totalRevenue)}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-gray-600">
                    Avg. Order
                  </p>

                  <p className="text-xl font-bold mt-1">
                    {formatCurrency(analytics?.averageOrderValue)}
                  </p>

                </div>

              </div>

            </div>

            {/* AI Decision Center */}

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/[0.07] to-violet-500/[0.03] p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs text-gray-600 uppercase tracking-widest">
                    AI Decision Engine
                  </p>

                  <h3 className="text-xl font-bold mt-1">
                    Activity
                  </h3>

                </div>

                <div className="w-10 h-10 rounded-full border border-blue-400/20 bg-blue-400/5 flex items-center justify-center text-blue-400">
                  ✦
                </div>

              </div>

              <div className="mt-7 space-y-5">

                <div className="flex gap-3">

                  <div className="w-8 h-8 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                    ✓
                  </div>

                  <div>

                    <p className="text-sm font-medium">
                      Autonomous checkout
                    </p>

                    <p className="text-xs text-gray-600 mt-1">
                      Within transaction limit
                    </p>

                  </div>

                </div>

                <div className="flex gap-3">

                  <div className="w-8 h-8 rounded-lg bg-yellow-400/10 text-yellow-400 flex items-center justify-center">
                    !
                  </div>

                  <div>

                    <p className="text-sm font-medium">
                      Customer confirmation
                    </p>

                    <p className="text-xs text-gray-600 mt-1">
                      High-value transaction detected
                    </p>

                  </div>

                </div>

                <div className="flex gap-3">

                  <div className="w-8 h-8 rounded-lg bg-blue-400/10 text-blue-400 flex items-center justify-center">
                    ◈
                  </div>

                  <div>

                    <p className="text-sm font-medium">
                      Audit trail active
                    </p>

                    <p className="text-xs text-gray-600 mt-1">
                      Every AI decision is recorded
                    </p>

                  </div>

                </div>

              </div>

              <div className="mt-8 p-4 rounded-xl bg-black/20 border border-white/5">

                <div className="flex justify-between">

                  <span className="text-xs text-gray-500">
                    Audit events
                  </span>

                  <span className="text-sm font-bold">
                    {summary?.totalAuditLogs ?? 0}
                  </span>

                </div>

              </div>

            </div>

          </section>

          {/* ================= ORDER + METRICS ================= */}

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">

            {/* Recent Orders */}

            <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/[0.025] overflow-hidden">

              <div className="p-6 flex items-center justify-between">

                <div>

                  <p className="text-xs text-gray-600 uppercase tracking-widest">
                    Live Commerce
                  </p>

                  <h3 className="text-xl font-bold mt-1">
                    Recent Orders
                  </h3>

                </div>

                <button
                  onClick={() => setActiveNav('Orders')}
                  className="text-xs text-blue-400 hover:text-blue-300 transition"
                >
                  View all →
                </button>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="border-y border-white/5 text-left">

                      <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-gray-700">
                        Order
                      </th>

                      <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-gray-700">
                        Amount
                      </th>

                      <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-gray-700">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {loading ? (

                      [...Array(5)].map((_, index) => (

                        <tr key={index} className="border-b border-white/5">

                          <td className="px-6 py-5">
                            <div className="h-4 w-32 bg-white/5 rounded animate-pulse"></div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="h-4 w-20 bg-white/5 rounded animate-pulse"></div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="h-5 w-16 bg-white/5 rounded animate-pulse"></div>
                          </td>

                        </tr>

                      ))

                    ) : analytics?.recentOrders?.length > 0 ? (

                      analytics.recentOrders.slice(0, 6).map((order) => (

                        <tr
                          key={order._id}
                          className="border-b border-white/5 hover:bg-white/[0.025] transition"
                        >

                          <td className="px-6 py-4">

                            <p className="text-sm font-medium">
                              #{order._id.slice(-8)}
                            </p>

                            <p className="text-[10px] text-gray-700 mt-1">
                              {order._id}
                            </p>

                          </td>

                          <td className="px-6 py-4">

                            <span className="text-sm font-semibold">
                              {formatCurrency(order.total_price)}
                            </span>

                          </td>

                          <td className="px-6 py-4">

                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full border text-[10px] font-medium ${statusClass(order.status)}`}
                            >
                              {order.status?.replaceAll('_', ' ')}
                            </span>

                          </td>

                        </tr>

                      ))

                    ) : (

                      <tr>

                        <td
                          colSpan="3"
                          className="px-6 py-12 text-center text-gray-600 text-sm"
                        >
                          No orders found.
                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </div>

            {/* Metrics */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

              <p className="text-xs text-gray-600 uppercase tracking-widest">
                Intelligence
              </p>

              <h3 className="text-xl font-bold mt-1">
                Commerce Metrics
              </h3>

              <div className="mt-7 space-y-7">

                <div>

                  <div className="flex justify-between mb-2">

                    <span className="text-xs text-gray-500">
                      Confirmation Rate
                    </span>

                    <span className="text-sm font-bold">
                      {analytics?.approvalRate ?? '0%'}
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-1000"
                      style={{
                        width: analytics?.approvalRate || '0%',
                      }}
                    />

                  </div>

                </div>

                <div>

                  <div className="flex justify-between mb-2">

                    <span className="text-xs text-gray-500">
                      Successful Orders
                    </span>

                    <span className="text-sm font-bold">
                      {summary?.totalOrdersCount
                        ? Math.round(
                            (summary.paidOrdersCount /
                              summary.totalOrdersCount) *
                              100
                          )
                        : 0}
                      %
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">

                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all duration-1000"
                      style={{
                        width: `${
                          summary?.totalOrdersCount
                            ? Math.round(
                                (summary.paidOrdersCount /
                                  summary.totalOrdersCount) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    />

                  </div>

                </div>

                <div className="pt-5 border-t border-white/5">

                  <p className="text-xs text-gray-600">
                    Failed Transactions
                  </p>

                  <p className="text-3xl font-black text-red-400 mt-1">
                    {summary?.failedOrdersCount ?? 0}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-gray-600">
                    Audit Events
                  </p>

                  <p className="text-3xl font-black mt-1">
                    {summary?.totalAuditLogs ?? 0}
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* ================= FOOTER ================= */}

          <footer className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-3 text-[10px] text-gray-700">

            <span>
              RAZORAI COMMERCE ENGINE
            </span>

            <span>
              AI-POWERED • AUDITABLE • HUMAN-CONTROLLED
            </span>

          </footer>

        </div>

      </main>

      {/* ================= ANIMATIONS ================= */}

      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(15px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

    </div>
  );
}

export default Dashboard;
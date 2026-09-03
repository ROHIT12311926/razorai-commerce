import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  const navItems = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: '⌂',
      end: true,
    },
    {
      name: 'Orders',
      path: '/dashboard/orders',
      icon: '▣',
    },
    {
      name: 'AI Activity',
      path: '/dashboard/ai-activity',
      icon: '✦',
    },
    {
      name: 'Confirmations',
      path: '/dashboard/confirmations',
      icon: '◉',
    },
    {
      name: 'Audit Logs',
      path: '/dashboard/audit-logs',
      icon: '◈',
    },
    {
      name: 'Analytics',
      path: '/dashboard/analytics',
      icon: '⌁',
    },
  ];

  return (
    <div className="min-h-screen bg-[#07090d] text-white">

      {/* ================= SIDEBAR ================= */}

      <aside className="fixed left-0 top-0 z-50 hidden lg:flex h-screen w-64 flex-col border-r border-white/10 bg-[#090b10]">

        {/* Logo */}

        <div className="border-b border-white/10 px-6 py-7">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-lg font-black shadow-lg shadow-blue-500/20">
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

        <nav className="flex-1 px-4 py-6">

          <p className="mb-4 px-3 text-[10px] uppercase tracking-[0.2em] text-gray-600">
            Workspace
          </p>

          <div className="space-y-2">

            {navItems.map((item) => (

              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-sm transition-all duration-300 ${
                    isActive
                      ? 'border-blue-500/20 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/5'
                      : 'border-transparent text-gray-500 hover:bg-white/5 hover:text-white'
                  }`
                }
              >

                <span className="flex w-5 justify-center text-lg">
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>

              </NavLink>

            ))}

          </div>

        </nav>

        {/* AI Status */}

        <div className="px-4 pb-4">

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">

            <div className="flex items-center gap-2">

              <span className="relative flex h-2.5 w-2.5">

                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>

              </span>

              <span className="text-xs text-gray-300">
                AI Engine Online
              </span>

            </div>

            <p className="mt-2 text-[10px] text-gray-600">
              Autonomous commerce system active
            </p>

          </div>

        </div>

        {/* Logout */}

        <div className="border-t border-white/10 p-4">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 transition hover:bg-red-500/5 hover:text-red-400"
          >

            <span className="text-lg">
              ⇥
            </span>

            Logout

          </button>

        </div>

      </aside>

      {/* ================= MOBILE TOP BAR ================= */}

      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#07090d]/90 px-5 backdrop-blur-xl lg:hidden">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 font-black">
            R
          </div>

          <div>

            <p className="text-sm font-bold">
              RazorAI
            </p>

            <p className="text-[9px] uppercase tracking-widest text-gray-600">
              Merchant
            </p>

          </div>

        </div>

        <button
          onClick={handleLogout}
          className="text-xs text-gray-500 hover:text-red-400"
        >
          Logout
        </button>

      </div>

      {/* ================= MAIN ================= */}

      <main className="min-h-screen lg:ml-64">

        {/* Desktop Header */}

        <header className="sticky top-0 z-30 hidden h-20 border-b border-white/10 bg-[#07090d]/80 backdrop-blur-xl lg:block">

          <div className="flex h-full items-center justify-between px-10">

            <div>

              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-600">
                Merchant Console
              </p>

              <p className="mt-1 text-sm text-gray-400">
                AI-powered commerce control center
              </p>

            </div>

            <div className="flex items-center gap-4">

              <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-2">

                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>

                <span className="text-[10px] text-emerald-400">
                  SYSTEMS OPERATIONAL
                </span>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold">
                M
              </div>

            </div>

          </div>

        </header>

        {/* Page Content */}

        <div className="min-h-[calc(100vh-5rem)]">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

export default DashboardLayout;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';

import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import AIActivity from './pages/AIActivity';
import Confirmations from './pages/Confirmations';
import AuditLogs from './pages/AuditLogs';
import Analytics from './pages/Analytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard + Sidebar Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>

          {/* /dashboard */}
          <Route index element={<Dashboard />} />

          {/* /dashboard/orders */}
          <Route path="orders" element={<Orders />} />

          {/* /dashboard/ai-activity */}
          <Route path="ai-activity" element={<AIActivity />} />

          {/* /dashboard/confirmations */}
          <Route path="confirmations" element={<Confirmations />} />

          {/* /dashboard/audit-logs */}
          <Route path="audit-logs" element={<AuditLogs />} />

          {/* /dashboard/analytics */}
          <Route path="analytics" element={<Analytics />} />

        </Route>

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
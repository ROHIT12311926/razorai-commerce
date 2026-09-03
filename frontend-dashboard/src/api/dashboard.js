import { getToken } from '../utils/auth';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const getDashboardSummary = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard summary');
  }

  return await response.json();
};

export const getDashboardAnalytics = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/analytics`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard analytics');
  }

  return await response.json();
};

export const getPendingApprovals = async () => {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/pending-approvals`,
    {
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch pending approvals');
  }

  return await response.json();
};
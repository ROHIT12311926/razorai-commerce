import { getToken } from '../utils/auth';

const API_BASE_URL = 'http://localhost:5000/api';

export const getDashboardSummary = async () => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard summary');
  }

  return await response.json();
};

export const getDashboardAnalytics = async () => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/dashboard/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard analytics');
  }

  return await response.json();
};
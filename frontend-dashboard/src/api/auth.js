const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

export const loginMerchant = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return await response.json();
};
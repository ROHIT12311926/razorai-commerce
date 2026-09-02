const API_BASE_URL = 'http://localhost:5000/api';

export const getCart = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/cart/${sessionId}`);
  const data = await response.json();
  return data;
};

export const removeFromCart = async (sessionId, productId) => {
  const response = await fetch(`${API_BASE_URL}/cart/${sessionId}/remove`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId }),
  });
  const data = await response.json();
  return data;
};

export const getCartTotal = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/cart/${sessionId}/total`);
  const data = await response.json();
  return data;
};
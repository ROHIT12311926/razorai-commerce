const API_BASE_URL = import.meta.env.VITE_API_URL;

export const initiateCheckout = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/order/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
  return await response.json();
};

export const approveOrder = async (orderId) => {
  const response = await fetch(`${API_BASE_URL}/order/${orderId}/approve`, {
    method: 'POST',
  });
  return await response.json();
};

export const verifyPayment = async (paymentData) => {
  const response = await fetch(`${API_BASE_URL}/order/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData),
  });
  return await response.json();
};
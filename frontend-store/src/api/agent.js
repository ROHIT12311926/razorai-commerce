const API_BASE_URL = 'http://localhost:5000/api';

export const sendMessageToAgent = async (message, sessionId) => {
  const response = await fetch(`${API_BASE_URL}/agent/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, sessionId }),
  });

  const data = await response.json();
  return data;
};
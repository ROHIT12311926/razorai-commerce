const API_BASE_URL = import.meta.env.VITE_API_URL;

export const sendMessageToAgent = async (message, sessionId) => {
  const response = await fetch(`${API_BASE_URL}/v1/agent/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, sessionId }),
  });

  const data = await response.json();
  return data;
};
export const getSessionId = () => {
  let sessionId = localStorage.getItem('razorai_session_id');

  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('razorai_session_id', sessionId);
  }

  return sessionId;
};
export const saveToken = (token) => {
  localStorage.setItem('razorai_merchant_token', token);
};

export const getToken = () => {
  return localStorage.getItem('razorai_merchant_token');
};

export const removeToken = () => {
  localStorage.removeItem('razorai_merchant_token');
};

export const isLoggedIn = () => {
  return !!getToken();
};
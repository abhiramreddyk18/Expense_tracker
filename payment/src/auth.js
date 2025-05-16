
const TOKEN_KEY = 'authToken';
const TOKEN_TIME_KEY = 'tokenTime';
const EXPIRY_DAYS = 7;

export const login = (token) => {
  console.log("logging in");
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_TIME_KEY, Date.now().toString());
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_TIME_KEY);
    localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const isLoggedIn = () => {
  const token = getToken();
  const time = localStorage.getItem(TOKEN_TIME_KEY);

  if (!token || !time) return false;

  const now = Date.now();
  const loginTime = parseInt(time, 10);
  const diffDays = (now - loginTime) / (1000 * 60 * 60 * 24);

  if (diffDays > EXPIRY_DAYS) {
    logout();
    return false;
  }

  return true;
};

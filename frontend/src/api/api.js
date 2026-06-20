import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const isLoginRequest = url.includes('/auth/login');
      const isRegisterRequest = url.includes('/auth/register');
      const skipLogout = error.config?._skipAuthLogout;

      if (!isLoginRequest && !isRegisterRequest && !skipLogout && unauthorizedHandler) {
        unauthorizedHandler(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

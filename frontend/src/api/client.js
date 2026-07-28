import axios from 'axios';

const staticApiUrl = import.meta.env.VITE_API_URL;
const API_URL = (staticApiUrl && !staticApiUrl.includes('localhost') && !staticApiUrl.includes('127.0.0.1'))
  ? staticApiUrl 
  : `http://${window.location.hostname}:5000/api/v1`;

let inMemoryAccessToken = null;

export const setAccessToken = (token) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = () => {
  return inMemoryAccessToken;
};

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const notifySubscribers = (error, token) => {
  refreshSubscribers.forEach((cb) => cb(error, token));
  refreshSubscribers = [];
};

const requestRefreshToken = () => axios.post(
  `${API_URL}/auth/refresh`,
  {},
  { withCredentials: true }
);

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    if (config.url && config.url.includes('/auth/refresh')) {
      return config;
    }
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const is401 = error.response?.status === 401;
    const isRetry = originalRequest._retry === true;
    const isRefreshRequest = originalRequest.url?.includes('/auth/refresh');
    const isLoginRequest = originalRequest.url?.includes('/auth/login');

    if (is401 && !isRetry && !isRefreshRequest && !isLoginRequest) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshResponse = await requestRefreshToken();
          const newAccessToken = refreshResponse.data.data.accessToken;
          setAccessToken(newAccessToken);
          isRefreshing = false;
          notifySubscribers(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          try {
            const recoveryResponse = await requestRefreshToken();
            const recoveredAccessToken = recoveryResponse.data.data.accessToken;
            setAccessToken(recoveredAccessToken);
            isRefreshing = false;
            notifySubscribers(null, recoveredAccessToken);

            originalRequest.headers.Authorization = `Bearer ${recoveredAccessToken}`;
            return apiClient(originalRequest);
          } catch (recoveryError) {
            isRefreshing = false;
            setAccessToken(null);
            notifySubscribers(recoveryError, null);
            if (!originalRequest.silent) {
              window.dispatchEvent(new Event('auth:unauthorized'));
            }
            return Promise.reject(recoveryError);
          }
        }
      }

      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((refreshError, token) => {
          if (refreshError) {
            reject(refreshError);
          } else {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          }
        });
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;

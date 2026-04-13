import axios from 'axios';

const DANGEROUS_CHARS = /[<>"'\\/;{}()]/;
const DANGEROUS_CHARS_PASSWORD = /[<>"';]/;

export function hasDangerousChars(value: string): boolean {
  return DANGEROUS_CHARS.test(value);
}

export function hasDangerousPasswordChars(value: string): boolean {
  return DANGEROUS_CHARS_PASSWORD.test(value);
}

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      original._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post('http://localhost:3000/api/auth/refresh', {
          refreshToken,
        });
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        original.headers.Authorization = `Bearer ${data.access_token}`;
        isRefreshing = false;
        return api(original);
      } catch {
        localStorage.clear();
        isRefreshing = false;
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
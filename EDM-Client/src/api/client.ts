import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;

// Rutas donde un 401 NO debe disparar el refresh automático,
// porque representan fallos de autenticación legítimos y no tokens expirados.
const AUTH_ENDPOINTS = ['/api/auth/login', '/api/auth/refresh'];

function isAuthEndpoint(url?: string): boolean {
  if (!url) return false;
  return AUTH_ENDPOINTS.some(endpoint => url.includes(endpoint));
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Si el 401 viene de login/refresh, no intentamos refrescar: dejamos
    // que el componente maneje el error directamente.
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !isAuthEndpoint(original.url)
    ) {
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
        const { data } = await axios.post(
          'http://localhost:3000/api/auth/refresh',
          { refreshToken },
        );
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
  },
);

export default api;
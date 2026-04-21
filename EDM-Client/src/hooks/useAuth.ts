import { useMemo } from 'react';
import type { JwtPayload } from '../types';

function decodeToken(token: string): JwtPayload | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

export function useAuth() {
  const user = useMemo<JwtPayload | null>(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    return decodeToken(token);
  }, []);

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = user !== null;

  return { user, isAdmin, isAuthenticated };
}
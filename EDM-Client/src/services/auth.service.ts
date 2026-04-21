import api from '../api/client';
import type {
  AuthTokens,
  JwtPayload,
  LoginDto,
  RegisterDto,
  User,
} from '../types';

export async function login(payload: LoginDto): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>('/api/auth/login', payload);
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  return data;
}

export async function register(payload: RegisterDto): Promise<User> {
  const { data } = await api.post<User>('/api/user', payload);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/api/auth/logout');
  } catch {
    // Ignorar errores de logout — siempre limpiamos el storage local
  }
  localStorage.clear();
}

export async function getMe(): Promise<JwtPayload> {
  const { data } = await api.get<JwtPayload>('/api/auth/me');
  return data;
}
import api from '../api/client';
import type { Log, LogFilters } from '../types';

export async function getLogs(filters?: LogFilters): Promise<Log[]> {
  const params: Record<string, string | number | boolean> = {};

  if (filters?.startDate) params.startDate = filters.startDate;
  if (filters?.endDate) params.endDate = filters.endDate;
  if (filters?.session_id) params.session_id = filters.session_id;
  if (filters?.username) params.username = filters.username;
  if (filters?.error_code) params.error_code = filters.error_code;
  if (filters?.onlyAnonymous) params.onlyAnonymous = true;

  const { data } = await api.get<Log[]>('/api/logs', { params });
  return data;
}
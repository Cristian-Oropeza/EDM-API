import api from '../api/client';
import type { UpdateUserDto, User } from '../types';

export async function getAllUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>('/api/user');
  return data;
}

export async function getUserById(id: number): Promise<User> {
  const { data } = await api.get<User>(`/api/user/${id}`);
  return data;
}

export async function updateUser(
  id: number,
  payload: UpdateUserDto,
): Promise<User> {
  const { data } = await api.put<User>(`/api/user/${id}`, payload);
  return data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/api/user/${id}`);
}
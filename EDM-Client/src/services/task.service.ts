import api from '../api/client';
import type { CreateTaskDto, Task, UpdateTaskDto } from '../types';

export async function getAllTasks(): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/api/task');
  return data;
}

export async function createTask(payload: CreateTaskDto): Promise<Task> {
  const { data } = await api.post<Task>('/api/task', payload);
  return data;
}

export async function updateTask(
  id: number,
  payload: UpdateTaskDto,
): Promise<Task> {
  const { data } = await api.put<Task>(`/api/task/${id}`, payload);
  return data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/api/task/${id}`);
}
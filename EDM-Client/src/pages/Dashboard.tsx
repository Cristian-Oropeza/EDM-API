import { useEffect, useState } from 'react';
import api from '../api/client';

interface Task {
  id: number;
  name: string;
  description: string;
  priority: boolean;
  user_id: number;
  createdAt: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

const getUser = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
    return JSON.parse(jsonPayload);
  } catch { return null; }
};

  const user = getUser();

  useEffect(() => {
    api.get('/api/task')
      .then(({ data }) => {
        const myTasks = data.filter((t: Task) => t.user_id === user?.id);
        setTasks(myTasks);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Bienvenido, {user?.name}</h1>
          <p className="text-slate-400 mt-1">Estas son tus tareas asignadas</p>
        </div>

        {loading ? (
          <div className="text-slate-400">Cargando...</div>
        ) : tasks.length === 0 ? (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-12 text-center">
            <p className="text-slate-400">No tienes tareas asignadas aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map(task => (
              <div key={task.id} className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-medium">{task.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    task.priority
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {task.priority ? 'Alta' : 'Normal'}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{task.description}</p>
                <p className="text-slate-600 text-xs mt-3">
                  {new Date(task.createdAt).toLocaleDateString('es-MX')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
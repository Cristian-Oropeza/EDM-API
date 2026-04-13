import { useEffect, useState } from 'react';
import api, { hasDangerousChars } from '../api/client';

interface Task {
  id: number;
  name: string;
  description: string;
  priority: boolean;
  user_id: number;
  createdAt: string;
}

const DANGEROUS_MSG = 'No se permiten los caracteres: < > " \' / \\ ; { } ( )';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState({ name: '', description: '', priority: false });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const getUser = () => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    try { return JSON.parse(atob(token.split('.')[1])); }
    catch { return null; }
  };
  const user = getUser();

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/api/task');
      setTasks(data);
    } catch {
      setError('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const openCreate = () => {
    setEditingTask(null);
    setForm({ name: '', description: '', priority: false });
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({ name: task.name, description: task.description, priority: task.priority });
    setFormError('');
    setShowForm(true);
  };

  const validateForm = (): string => {
    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) return 'El nombre no puede estar vacío';
    if (!description) return 'La descripción no puede estar vacía';
    if (hasDangerousChars(name)) return `Nombre: ${DANGEROUS_MSG}`;
    if (hasDangerousChars(description)) return `Descripción: ${DANGEROUS_MSG}`;
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        priority: form.priority,
      };
      if (editingTask) {
        await api.put(`/api/task/${editingTask.id}`, payload);
      } else {
        await api.post('/api/task', payload);
      }
      setShowForm(false);
      fetchTasks();
    } catch (err: any) {
      const msg = err.response?.data?.error;
      setFormError(Array.isArray(msg) ? msg.join(', ') : msg || 'Error al guardar la tarea');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (task: Task) => {
    if (!confirm(`¿Eliminar la tarea "${task.name}"?`)) return;
    try {
      await api.delete(`/api/task/${task.id}`);
      fetchTasks();
    } catch (err: any) {
      const msg = err.response?.data?.error;
      alert(Array.isArray(msg) ? msg.join(', ') : msg || 'Error al eliminar');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Todas las tareas</h1>
            <p className="text-slate-400 mt-1">Puedes editar y eliminar solo tus propias tareas</p>
          </div>
          <button
            onClick={openCreate}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Nueva tarea
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-white font-semibold text-lg mb-5">
                {editingTask ? 'Editar tarea' : 'Nueva tarea'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Descripción</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={3}
                    required
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="priority"
                    checked={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.checked })}
                    className="w-4 h-4 accent-indigo-500"
                  />
                  <label htmlFor="priority" className="text-slate-300 text-sm">Alta prioridad</label>
                </div>
                {formError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                    {formError}
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2.5 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
                  >
                    {formLoading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-slate-400">Cargando...</div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400">{error}</div>
        ) : (
          <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">ID</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Nombre</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Descripción</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Prioridad</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Usuario</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3 text-slate-400 text-sm">{task.id}</td>
                    <td className="px-5 py-3 text-white text-sm font-medium">{task.name}</td>
                    <td className="px-5 py-3 text-slate-400 text-sm">{task.description}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        task.priority
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-slate-700 text-slate-400'
                      }`}>
                        {task.priority ? 'Alta' : 'Normal'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-sm">{task.user_id}</td>
                    <td className="px-5 py-3">
                      {task.user_id === user?.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(task)}
                            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(task)}
                            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
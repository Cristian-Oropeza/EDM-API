import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { hasDangerousChars, hasDangerousPasswordChars } from '../api/client';

const DANGEROUS_MSG = 'No se permiten los caracteres: < > " \' / \\ ; { } ( )';
const DANGEROUS_PASSWORD_MSG = 'No se permiten los caracteres: < > " \' ;';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ name: '', lastName: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getUserFromToken = () => {
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

  useEffect(() => {
    const tokenUser = getUserFromToken();
    if (!tokenUser) return;
    api.get(`/api/user/${tokenUser.id}`).then(({ data }) => {
      setUser(data);
      setForm({ name: data.name, lastName: data.lastName, username: data.username, password: '' });
    });
  }, []);

  const validate = (): string => {
    const name = form.name.trim();
    const lastName = form.lastName.trim();
    const username = form.username.trim();
    const password = form.password.trim();

    if (!name) return 'El nombre no puede estar vacío';
    if (!lastName) return 'El apellido no puede estar vacío';
    if (!username) return 'El usuario no puede estar vacío';

    if (hasDangerousChars(name)) return `Nombre: ${DANGEROUS_MSG}`;
    if (hasDangerousChars(lastName)) return `Apellido: ${DANGEROUS_MSG}`;
    if (hasDangerousChars(username)) return `Usuario: ${DANGEROUS_MSG}`;
    if (password && hasDangerousPasswordChars(password)) return `Contraseña: ${DANGEROUS_PASSWORD_MSG}`;
    return '';
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        name: form.name.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
      };
      if (form.password.trim()) payload.password = form.password.trim();
      await api.put(`/api/user/${user.id}`, payload);
      setSuccess('Perfil actualizado correctamente');
      setForm(f => ({ ...f, password: '' }));
    } catch (err: any) {
      const msg = err.response?.data?.error;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/user/${user.id}`);
      localStorage.clear();
      navigate('/login');
    } catch (err: any) {
      const msg = err.response?.data?.error;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Error al eliminar la cuenta');
      setDeleteLoading(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-slate-400">Cargando...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Mi perfil</h1>
          <p className="text-slate-400 mt-1">Actualiza tu información personal</p>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-slate-300 mb-1">Apellido</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Nueva contraseña <span className="text-slate-500 font-normal">(dejar vacío para no cambiar)</span>
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>
            )}
            {success && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-green-400 text-sm">{success}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h3 className="text-red-400 font-medium mb-2">Zona de peligro</h3>
            <p className="text-slate-400 text-sm mb-4">
              Al eliminar tu cuenta se borrarán todos tus datos permanentemente.
            </p>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {deleteLoading ? 'Eliminando...' : 'Eliminar mi cuenta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
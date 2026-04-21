import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserById, updateUser, deleteUser } from '../services/user.service';
import {
  hasDangerousChars,
  hasDangerousPasswordChars,
  DANGEROUS_MSG,
  DANGEROUS_PASSWORD_MSG,
  getPasswordErrors,
  extractErrorMessages,
  getErrorStatus,
} from '../utils/validation';
import Alert from '../components/Alert';
import type { User, UpdateUserDto } from '../types';

export default function Profile() {
  const navigate = useNavigate();
  const { user: tokenUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', lastName: '', password: '' });
  const [errors, setErrors] = useState<string[]>([]);
  const [alertType, setAlertType] = useState<'error' | 'warning'>('warning');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!tokenUser) return;
    getUserById(tokenUser.id).then(data => {
      setUser(data);
      setForm({
        name: data.name,
        lastName: data.lastName,
        password: '',
      });
    });
  }, [tokenUser]);

  const validate = (): string[] => {
    const errs: string[] = [];
    const name = form.name.trim();
    const lastName = form.lastName.trim();
    const password = form.password;

    if (!name) errs.push('El nombre no puede estar vacío');
    if (!lastName) errs.push('El apellido no puede estar vacío');

    if (name && hasDangerousChars(name)) errs.push(`Nombre: ${DANGEROUS_MSG}`);
    if (lastName && hasDangerousChars(lastName)) errs.push(`Apellido: ${DANGEROUS_MSG}`);

    // Password es opcional, pero si se escribió algo debe ser fuerte
    if (password) {
      if (hasDangerousPasswordChars(password)) {
        errs.push(`Contraseña: ${DANGEROUS_PASSWORD_MSG}`);
      }
      errs.push(...getPasswordErrors(password));
    }

    return errs;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');

    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setAlertType('warning');
      setErrors(validationErrors);
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      const payload: UpdateUserDto = {
        name: form.name.trim(),
        lastName: form.lastName.trim(),
      };
      if (form.password) payload.password = form.password;

      await updateUser(user.id, payload);
      setSuccess('Perfil actualizado correctamente');
      setForm(f => ({ ...f, password: '' }));
    } catch (err: any) {
      const status = getErrorStatus(err);
      setAlertType(status >= 500 ? 'error' : 'warning');
      setErrors(extractErrorMessages(err, 'Error al actualizar'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) return;
    if (!user) return;

    setDeleteLoading(true);
    try {
      await deleteUser(user.id);
      localStorage.clear();
      navigate('/login');
    } catch (err: any) {
      const status = getErrorStatus(err);
      setAlertType(status >= 500 ? 'error' : 'warning');
      setErrors(extractErrorMessages(err, 'Error al eliminar la cuenta'));
      setDeleteLoading(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-slate-400">Cargando...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Mi perfil</h1>
          <p className="text-slate-400 mt-1">Actualiza tu información personal</p>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Username <span className="text-slate-500 font-normal">(no editable)</span>
              </label>
              <input
                type="text"
                value={user.username}
                disabled
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-500 cursor-not-allowed"
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
              <p className="text-xs text-slate-500 mt-1">
                Si la cambias, debe tener 8+ caracteres, mayúscula, minúscula, número y símbolo
              </p>
            </div>
            {errors.length > 0 && (
              <Alert type={alertType} messages={errors} onClose={() => setErrors([])} />
            )}
            {success && (
              <Alert type="success" messages={success} onClose={() => setSuccess('')} />
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
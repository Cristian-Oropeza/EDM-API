import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAllUsers, updateUser } from '../services/user.service';
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

export default function Users() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string[]>([]);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', lastName: '', password: '' });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [formAlertType, setFormAlertType] = useState<'error' | 'warning'>('warning');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      setListError(['Error al cargar usuarios']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEdit = (u: User) => {
    setEditingUser(u);
    setForm({ name: u.name, lastName: u.lastName, password: '' });
    setFormErrors([]);
    setFormSuccess('');
  };

  const closeEdit = () => {
    setEditingUser(null);
    setFormErrors([]);
    setFormSuccess('');
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    const name = form.name.trim();
    const lastName = form.lastName.trim();
    const password = form.password;

    if (!name) errs.push('El nombre no puede estar vacío');
    if (!lastName) errs.push('El apellido no puede estar vacío');

    if (name && hasDangerousChars(name)) errs.push(`Nombre: ${DANGEROUS_MSG}`);
    if (lastName && hasDangerousChars(lastName)) errs.push(`Apellido: ${DANGEROUS_MSG}`);

    if (password) {
      if (hasDangerousPasswordChars(password)) {
        errs.push(`Contraseña: ${DANGEROUS_PASSWORD_MSG}`);
      }
      errs.push(...getPasswordErrors(password));
    }

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);
    setFormSuccess('');

    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setFormAlertType('warning');
      setFormErrors(validationErrors);
      return;
    }

    if (!editingUser) return;

    setFormLoading(true);
    try {
      const payload: UpdateUserDto = {
        name: form.name.trim(),
        lastName: form.lastName.trim(),
      };
      if (form.password) payload.password = form.password;

      await updateUser(editingUser.id, payload);
      setFormSuccess('Usuario actualizado correctamente');
      fetchUsers();
    } catch (err: any) {
      const status = getErrorStatus(err);
      setFormAlertType(status >= 500 ? 'error' : 'warning');
      setFormErrors(extractErrorMessages(err, 'Error al actualizar'));
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Usuarios</h1>
          <p className="text-slate-400 mt-1">
            {isAdmin
              ? 'Como administrador puedes editar cualquier usuario'
              : 'Todos los usuarios registrados en el sistema'}
          </p>
        </div>

        {loading ? (
          <div className="text-slate-400">Cargando...</div>
        ) : listError.length > 0 ? (
          <Alert type="error" messages={listError} />
        ) : (
          <>
            {/* Desktop: Tabla */}
            <div className="hidden md:block bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">ID</th>
                    <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Nombre</th>
                    <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Apellido</th>
                    <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Username</th>
                    <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Registrado</th>
                    {isAdmin && (
                      <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Acciones</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-3 text-slate-400 text-sm">{u.id}</td>
                      <td className="px-5 py-3 text-white text-sm font-medium">{u.name}</td>
                      <td className="px-5 py-3 text-slate-400 text-sm">{u.lastName}</td>
                      <td className="px-5 py-3 text-slate-400 text-sm">@{u.username}</td>
                      <td className="px-5 py-3 text-slate-400 text-sm">
                        {new Date(u.createdAt).toLocaleDateString('es-MX')}
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-3">
                          <button
                            onClick={() => openEdit(u)}
                            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                          >
                            Editar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: Cards */}
            <div className="md:hidden space-y-3">
              {users.map(u => (
                <div key={u.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="min-w-0">
                      <p className="text-slate-500 text-xs mb-1">#{u.id}</p>
                      <h3 className="text-white font-medium break-words">{u.name} {u.lastName}</h3>
                      <p className="text-slate-400 text-sm break-words">@{u.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <span className="text-slate-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString('es-MX')}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => openEdit(u)}
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                      >
                        Editar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Modal edición admin */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-white font-semibold text-lg mb-1">Editar usuario</h2>
              <p className="text-slate-500 text-xs mb-5">
                El username no puede modificarse
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Username <span className="text-slate-500 font-normal">(solo lectura)</span>
                  </label>
                  <input
                    type="text"
                    value={editingUser.username}
                    disabled
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-500 cursor-not-allowed"
                  />
                </div>
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
                {formErrors.length > 0 && (
                  <Alert type={formAlertType} messages={formErrors} onClose={() => setFormErrors([])} />
                )}
                {formSuccess && (
                  <Alert type="success" messages={formSuccess} onClose={() => setFormSuccess('')} />
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeEdit}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2.5 rounded-lg transition-colors"
                  >
                    Cerrar
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
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { hasDangerousChars, hasDangerousPasswordChars } from '../api/client';

const DANGEROUS_MSG = 'No se permiten los caracteres: < > " \' / \\ ; { } ( )';
const DANGEROUS_PASSWORD_MSG = 'No se permiten los caracteres: < > " \' ;';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', lastName: '', username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState<string | string[]>('');
  const [loading, setLoading] = useState(false);

  const validate = (): string => {
    const { name, lastName, username, password, confirmPassword } = form;

    if (!name.trim()) return 'El nombre no puede estar vacío';
    if (!lastName.trim()) return 'El apellido no puede estar vacío';
    if (!username.trim()) return 'El usuario no puede estar vacío';
    if (!password.trim()) return 'La contraseña no puede estar vacía';
    if (!confirmPassword.trim()) return 'Debes confirmar la contraseña';

    if (hasDangerousChars(name.trim())) return `Nombre: ${DANGEROUS_MSG}`;
    if (hasDangerousChars(lastName.trim())) return `Apellido: ${DANGEROUS_MSG}`;
    if (hasDangerousChars(username.trim())) return `Usuario: ${DANGEROUS_MSG}`;
    if (hasDangerousPasswordChars(password.trim())) return `Contraseña: ${DANGEROUS_PASSWORD_MSG}`;
    if (hasDangerousPasswordChars(confirmPassword.trim())) return `Confirmar contraseña: ${DANGEROUS_PASSWORD_MSG}`;

    if (password !== confirmPassword) return 'Las contraseñas no coinciden';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/user', {
        name: form.name.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        password: form.password.trim(),
      });
      navigate('/login');
    } catch (err: any) {
      const msg = err.response?.data?.error;
      setError(msg || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const errors = Array.isArray(error) ? error : error ? [error] : [];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">EDM</h1>
          <p className="text-slate-400 mt-2">Crea tu cuenta</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Juan"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Apellido</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Pérez"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Usuario</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="tu_usuario"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Mín. 8 caracteres, mayúscula, número y símbolo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Confirmar contraseña</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                required
              />
            </div>
            {errors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm space-y-1">
                {errors.map((e, i) => <p key={i}>{e}</p>)}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>
          <p className="text-center text-slate-400 text-sm mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
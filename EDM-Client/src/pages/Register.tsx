import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/auth.service';
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

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [alertType, setAlertType] = useState<'error' | 'warning'>('warning');
  const [loading, setLoading] = useState(false);

  const validate = (): string[] => {
    const errs: string[] = [];
    const name = form.name.trim();
    const lastName = form.lastName.trim();
    const username = form.username.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!name) errs.push('El nombre no puede estar vacío');
    if (!lastName) errs.push('El apellido no puede estar vacío');
    if (!username) errs.push('El usuario no puede estar vacío');
    if (!password) errs.push('La contraseña no puede estar vacía');
    if (!confirmPassword) errs.push('Debes confirmar la contraseña');

    if (name && hasDangerousChars(name)) errs.push(`Nombre: ${DANGEROUS_MSG}`);
    if (lastName && hasDangerousChars(lastName)) errs.push(`Apellido: ${DANGEROUS_MSG}`);
    if (username && hasDangerousChars(username)) errs.push(`Usuario: ${DANGEROUS_MSG}`);
    if (password && hasDangerousPasswordChars(password))
      errs.push(`Contraseña: ${DANGEROUS_PASSWORD_MSG}`);
    if (confirmPassword && hasDangerousPasswordChars(confirmPassword))
      errs.push(`Confirmar contraseña: ${DANGEROUS_PASSWORD_MSG}`);

    if (password) {
      errs.push(...getPasswordErrors(password));
    }

    if (password && confirmPassword && password !== confirmPassword) {
      errs.push('Las contraseñas no coinciden');
    }

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setAlertType('warning');
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        password: form.password,
      });
      navigate('/login');
    } catch (err: any) {
      const status = getErrorStatus(err);
      setAlertType(status >= 500 ? 'error' : 'warning');
      setErrors(extractErrorMessages(err, 'Error al registrarse'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">EDM</h1>
          <p className="text-slate-400 mt-2">Crea tu cuenta</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                placeholder="Mín. 8 caracteres, mayús, minús, número y símbolo"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Debe incluir mayúscula, minúscula, número y símbolo
              </p>
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
              <Alert type={alertType} messages={errors} onClose={() => setErrors([])} />
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
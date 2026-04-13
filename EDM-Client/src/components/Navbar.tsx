import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/client';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {}
    localStorage.clear();
    navigate('/login');
  };

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-slate-700 text-white'
        : 'text-slate-400 hover:text-white hover:bg-slate-700'
    }`;

  return (
    <nav className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-1">
            <span className="text-white font-bold text-lg mr-6">EDM</span>
            <Link to="/" className={linkClass('/')}>Dashboard</Link>
            <Link to="/tasks" className={linkClass('/tasks')}>Tareas</Link>
            <Link to="/users" className={linkClass('/users')}>Usuarios</Link>
            <Link to="/logs" className={linkClass('/logs')}>Logs</Link>
            <Link to="/profile" className={linkClass('/profile')}>Perfil</Link>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 text-sm font-medium transition-colors px-3 py-2 rounded-md hover:bg-slate-800"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
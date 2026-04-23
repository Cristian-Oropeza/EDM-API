import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../services/auth.service';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/tasks', label: 'Tareas' },
    ...(isAdmin ? [{ to: '/users', label: 'Usuarios' }] : []),
    { to: '/logs', label: 'Logs' },
    { to: '/profile', label: 'Perfil' },
  ];

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-slate-700 text-white'
        : 'text-slate-400 hover:text-white hover:bg-slate-700'
    }`;

  const mobileLinkClass = (path: string) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      location.pathname === path
        ? 'bg-slate-700 text-white'
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`;

  return (
    <nav className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <span className="text-white font-bold text-lg">EDM</span>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 flex-1 ml-6">
            {links.map(link => (
              <Link key={link.to} to={link.to} className={linkClass(link.to)}>
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="hidden md:block text-slate-400 hover:text-red-400 text-sm font-medium transition-colors px-3 py-2 rounded-md hover:bg-slate-800"
          >
            Cerrar sesión
          </button>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden text-slate-300 hover:text-white p-2 rounded-md hover:bg-slate-800 transition-colors"
            aria-label="Menú"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={mobileLinkClass(link.to)}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => { setMenuOpen(false); handleLogout(); }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-800 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
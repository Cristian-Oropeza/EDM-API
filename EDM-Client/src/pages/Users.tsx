import { useEffect, useState } from 'react';
import api from '../api/client';

interface User {
  id: number;
  name: string;
  lastName: string;
  username: string;
  createdAt: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/user')
      .then(({ data }) => setUsers(data))
      .catch(() => setError('Error al cargar usuarios'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Usuarios</h1>
          <p className="text-slate-400 mt-1">Todos los usuarios registrados en el sistema</p>
        </div>

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
                  <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Apellido</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Username</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Registrado</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3 text-slate-400 text-sm">{user.id}</td>
                    <td className="px-5 py-3 text-white text-sm font-medium">{user.name}</td>
                    <td className="px-5 py-3 text-slate-400 text-sm">{user.lastName}</td>
                    <td className="px-5 py-3 text-slate-400 text-sm">@{user.username}</td>
                    <td className="px-5 py-3 text-slate-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString('es-MX')}
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
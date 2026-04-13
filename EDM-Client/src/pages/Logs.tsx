import { useEffect, useState } from 'react';
import api from '../api/client';

interface Log {
  id: number;
  status_code: number;
  timestamp: string;
  path: string;
  error: string;
  error_code: string;
  session_id: number | null;
}

export default function Logs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/logs')
      .then(({ data }) => setLogs(data))
      .catch(() => setError('Error al cargar los logs'))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (code: number) => {
    if (code < 400) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (code < 500) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Logs del sistema</h1>
          <p className="text-slate-400 mt-1">Registro de errores y eventos</p>
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
                  <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Status</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Path</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Error</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Código</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Sesión</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-5 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3 text-slate-400 text-sm">{log.id}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium border ${statusColor(log.status_code)}`}>
                        {log.status_code}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-sm font-mono">{log.path}</td>
                    <td className="px-5 py-3 text-slate-400 text-sm max-w-xs truncate">{log.error}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs font-mono">{log.error_code}</td>
                    <td className="px-5 py-3 text-slate-400 text-sm">{log.session_id ?? '—'}</td>
                    <td className="px-5 py-3 text-slate-400 text-sm">
                      {new Date(log.timestamp).toLocaleString('es-MX')}
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
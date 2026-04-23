import { useEffect, useState } from 'react';
import { getLogs } from '../services/logs.service';
import Alert from '../components/Alert';
import type { Log, LogFilters } from '../types';
import { ERROR_CODES } from '../utils/error-codes';

export default function Logs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string[]>([]);
  const [filters, setFilters] = useState<{
    startDate: string;
    endDate: string;
    username: string;
    error_code: string;
    onlyAnonymous: boolean;
  }>({
    startDate: '',
    endDate: '',
    username: '',
    error_code: '',
    onlyAnonymous: false,
  });

  const fetchLogs = async (applied?: LogFilters) => {
    setLoading(true);
    setError([]);
    try {
      const data = await getLogs(applied);
      setLogs(data);
    } catch {
      setError(['Error al cargar los logs']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleFilter = () => {
    const applied: LogFilters = {};
    if (filters.startDate) applied.startDate = new Date(filters.startDate).toISOString();
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      applied.endDate = end.toISOString();
    }
    if (filters.onlyAnonymous) {
      applied.onlyAnonymous = true;
    } else if (filters.username.trim()) {
      applied.username = filters.username.trim();
    }
    if (filters.error_code) applied.error_code = filters.error_code;
    fetchLogs(applied);
  };

  const handleClear = () => {
    setFilters({ startDate: '', endDate: '', username: '', error_code: '', onlyAnonymous: false });
    fetchLogs();
  };

  const statusColor = (code: number) => {
    if (code < 400) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (code < 500) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Logs del sistema</h1>
          <p className="text-slate-400 mt-1">Registro de errores y eventos</p>
        </div>

        {/* Panel de filtros */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 sm:p-5 mb-6">
          <h2 className="text-white font-medium mb-4">Filtros</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Desde</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={e => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Hasta</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={e => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Username</label>
              <input
                type="text"
                value={filters.username}
                disabled={filters.onlyAnonymous}
                onChange={e => setFilters({ ...filters, username: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Ej: cristian.oropeza"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Código de error</label>
              <select
                value={filters.error_code}
                onChange={e => setFilters({ ...filters, error_code: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Todos</option>
                {ERROR_CODES.map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <input
              type="checkbox"
              id="onlyAnonymous"
              checked={filters.onlyAnonymous}
              onChange={e => setFilters({ ...filters, onlyAnonymous: e.target.checked, username: '' })}
              className="w-4 h-4 accent-indigo-500"
            />
            <label htmlFor="onlyAnonymous" className="text-slate-300 text-sm">
              Solo logs sin usuario registrado
            </label>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={handleFilter}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2 rounded-lg transition-colors text-sm"
            >
              Filtrar
            </button>
            <button
              onClick={handleClear}
              className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-5 py-2 rounded-lg transition-colors text-sm"
            >
              Limpiar
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-400">Cargando...</div>
        ) : error.length > 0 ? (
          <Alert type="error" messages={error} />
        ) : logs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 text-center">
            <p className="text-slate-400">No hay logs que coincidan con los filtros</p>
          </div>
        ) : (
          <>
            {/* Desktop: Tabla */}
            <div className="hidden md:block bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
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
            </div>

            {/* Mobile: Cards */}
            <div className="md:hidden space-y-3">
              {logs.map(log => (
                <div key={log.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="min-w-0">
                      <p className="text-slate-500 text-xs mb-1">#{log.id}</p>
                      <p className="text-slate-400 text-sm font-mono break-all">{log.path}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium border shrink-0 ${statusColor(log.status_code)}`}>
                      {log.status_code}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-2 break-words">{log.error}</p>
                  <p className="text-slate-500 text-xs font-mono mb-3 break-all">{log.error_code}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <span className="text-slate-500 text-xs">
                      Sesión: {log.session_id ?? '—'}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {new Date(log.timestamp).toLocaleString('es-MX')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
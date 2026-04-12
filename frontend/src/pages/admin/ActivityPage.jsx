import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ActivityPage() {
  const { authFetch } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 30;

  useEffect(() => { loadLogs(); }, [page]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`/api/admin/cms/activity-logs?page=${page}&per_page=${perPage}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs?.data || data.logs || []);
        setTotal(data.logs?.total || 0);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const totalPages = Math.ceil(total / perPage);

  const actionColors = {
    login: 'bg-blue-100 text-blue-700',
    create: 'bg-emerald-100 text-emerald-700',
    update: 'bg-yellow-100 text-yellow-700',
    delete: 'bg-red-100 text-red-700',
  };

  const getActionColor = (action) => {
    const key = Object.keys(actionColors).find(k => action?.toLowerCase().includes(k));
    return actionColors[key] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-sm text-gray-500">Audit trail of all admin actions</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full" /></div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No activity logs yet</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {logs.map((log, i) => (
              <div key={i} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium mt-0.5 ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{log.admin_username || 'System'}</span>
                        {log.entity_type && (
                          <span className="text-gray-500"> on <span className="font-mono text-xs">{log.entity_type}</span></span>
                        )}
                        {log.entity_id && (
                          <span className="text-gray-400 font-mono text-xs"> #{log.entity_id}</span>
                        )}
                      </p>
                      {log.description && <p className="text-xs text-gray-500 mt-0.5">{log.description}</p>}
                      {log.ip_address && (
                        <p className="text-xs text-gray-400 mt-0.5">IP: {log.ip_address}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                    {log.created_at ? new Date(log.created_at).toLocaleString() : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

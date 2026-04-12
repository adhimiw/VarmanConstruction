import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function VisitorsPage() {
  const { authFetch } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const perPage = 20;

  useEffect(() => { loadVisitors(); }, [page, search]);

  const loadVisitors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, per_page: perPage });
      if (search) params.set('search', search);
      const res = await authFetch(`/api/admin/cms/visitors?${params}`);
      if (res.ok) {
        const data = await res.json();
        setVisitors(data.visitors?.data || data.visitors || []);
        setTotal(data.visitors?.total || 0);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadDetail = async (id) => {
    try {
      const res = await authFetch(`/api/admin/cms/visitors/${id}`);
      if (res.ok) setSelected(await res.json());
    } catch (err) { console.error(err); }
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visitors & IP Tracking</h1>
          <p className="text-sm text-gray-500">{total} total visitor sessions</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search IP, country, city..."
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none w-full sm:w-64"
        />
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Visitor Detail</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="space-y-3 text-sm">
              <Row label="IP Address" value={selected.visitor?.ip_address} />
              <Row label="Country" value={selected.visitor?.country} />
              <Row label="City" value={selected.visitor?.city} />
              <Row label="Device" value={selected.visitor?.device_type} />
              <Row label="Browser" value={selected.visitor?.browser} />
              <Row label="OS" value={selected.visitor?.os} />
              <Row label="Pages Viewed" value={selected.visitor?.pages_viewed} />
              <Row label="First Visit" value={selected.visitor?.first_visit_at ? new Date(selected.visitor.first_visit_at).toLocaleString() : '—'} />
              <Row label="Last Activity" value={selected.visitor?.last_activity_at ? new Date(selected.visitor.last_activity_at).toLocaleString() : '—'} />
              {selected.visitor?.referrer && <Row label="Referrer" value={selected.visitor.referrer} />}
              {selected.page_views && selected.page_views.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Page Views</h4>
                  <div className="space-y-1">
                    {selected.page_views.map((pv, i) => (
                      <div key={i} className="flex justify-between bg-gray-50 rounded px-3 py-2">
                        <span className="font-mono text-xs text-gray-700">{pv.page_url}</span>
                        <span className="text-xs text-gray-400">{pv.visited_at ? new Date(pv.visited_at).toLocaleString() : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full" />
          </div>
        ) : visitors.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No visitors found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">IP Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Device</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Browser</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pages</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Last Visit</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visitors.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-900">{v.ip_address}</td>
                    <td className="px-4 py-3 text-gray-600">{[v.city, v.country].filter(Boolean).join(', ') || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
                        {v.device_type || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{v.browser || '—'}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{v.pages_viewed || 0}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{v.last_activity_at ? new Date(v.last_activity_at).toLocaleString() : '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => loadDetail(v.id)} className="text-orange-600 hover:text-orange-700 text-xs font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
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

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-1 border-b border-gray-100">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium">{value || '—'}</span>
    </div>
  );
}

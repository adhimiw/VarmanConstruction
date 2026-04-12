import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  reviewed: 'bg-blue-100 text-blue-700',
  quoted: 'bg-purple-100 text-purple-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function QuotesPage() {
  const { authFetch } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => { loadQuotes(); }, []);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/admin/quotes');
      if (res.ok) { const d = await res.json(); setQuotes(d.quotes || []); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try { await authFetch(`/api/admin/quotes/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }); loadQuotes(); }
    catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this quote?')) return;
    try { await authFetch(`/api/admin/quotes/${id}`, { method: 'DELETE' }); setSelected(null); loadQuotes(); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
        <p className="text-sm text-gray-500">{quotes.length} total quotes</p>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Quote Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-500">Name:</span> <span className="font-medium">{selected.name}</span></div>
              {selected.email && <div><span className="text-gray-500">Email:</span> <span className="font-medium">{selected.email}</span></div>}
              {selected.phone && <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{selected.phone}</span></div>}
              {selected.materials && (() => {
                let mats = '';
                try { const p = typeof selected.materials === 'string' ? JSON.parse(selected.materials) : selected.materials; mats = Array.isArray(p) ? p.join(', ') : String(p); } catch { mats = selected.materials; }
                return <div><span className="text-gray-500">Materials:</span> <span className="font-medium">{mats}</span></div>;
              })()}
              {selected.quantity && <div><span className="text-gray-500">Quantity:</span> <span className="font-medium">{selected.quantity}</span></div>}
              {selected.timeline && <div><span className="text-gray-500">Timeline:</span> <span className="font-medium">{selected.timeline}</span></div>}
              {selected.project_details && (
                <div>
                  <span className="text-gray-500">Project Details:</span>
                  <p className="mt-1 bg-gray-50 rounded p-3 text-gray-700">{selected.project_details}</p>
                </div>
              )}
              <div className="pt-2 flex gap-2 flex-wrap">
                {['pending', 'reviewed', 'quoted', 'accepted', 'rejected'].map(s => (
                  <button key={s} onClick={() => { updateStatus(selected.id, s); setSelected({ ...selected, status: s }); }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selected.status === s ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-gray-300' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleDelete(selected.id)} className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full" /></div>
        ) : quotes.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No quote requests yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Materials</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quotes.map(q => (
                  <tr key={q.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(q)}>
                    <td className="px-4 py-3 font-medium text-gray-900">{q.name}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{(() => { try { const p = typeof q.materials === 'string' ? JSON.parse(q.materials) : q.materials; return Array.isArray(p) ? p.join(', ') : String(p || '—'); } catch { return q.materials || '—'; } })()}</td>
                    <td className="px-4 py-3 text-gray-600">{q.quantity || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[q.status] || 'bg-gray-100 text-gray-600'}`}>
                        {q.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{q.created_at ? new Date(q.created_at).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={e => { e.stopPropagation(); handleDelete(q.id); }} className="text-red-500 hover:text-red-600 text-xs">Delete</button>
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

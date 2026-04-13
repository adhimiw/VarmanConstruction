import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-purple-100 text-purple-700',
  proposal: 'bg-orange-100 text-orange-700',
  won: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-red-100 text-red-700',
};

const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];

export default function LeadsPage() {
  const { authFetch } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', source: '', status: 'new', notes: '', value: '' });
  const perPage = 15;

  useEffect(() => { loadLeads(); }, [page, filter, search]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, per_page: perPage });
      if (filter) params.set('status', filter);
      if (search) params.set('search', search);
      const res = await authFetch(`/api/admin/cms/leads?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads?.data || data.leads || []);
        setTotal(data.leads?.total || 0);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ name: '', email: '', phone: '', company: '', source: '', status: 'new', notes: '', value: '' });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (lead) => {
    setForm({
      name: lead.name || '', email: lead.email || '', phone: lead.phone || '',
      company: lead.company || '', source: lead.source || '', status: lead.status || 'new',
      notes: lead.notes || '', value: lead.value || '',
    });
    setEditing(lead.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editing ? `/api/admin/cms/leads/${editing}` : '/api/admin/cms/leads';
      const method = editing ? 'PUT' : 'POST';
      const res = await authFetch(url, { method, body: JSON.stringify(form) });
      if (res.ok) {
        resetForm();
        loadLeads();
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead?')) return;
    try {
      await authFetch(`/api/admin/cms/leads/${id}`, { method: 'DELETE' });
      loadLeads();
    } catch (err) { console.error(err); }
  };

  const updateStatus = async (id, status) => {
    try {
      await authFetch(`/api/admin/cms/leads/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
      loadLeads();
    } catch (err) { console.error(err); }
  };

  const totalPages = Math.ceil(total / perPage);

  // Pipeline counts
  const pipeline = STATUSES.map(s => ({ status: s, count: leads.filter(l => l.status === s).length }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads (CRM)</h1>
          <p className="text-sm text-gray-500">{total} total leads</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-red-700 transition-all shadow">
          + Add Lead
        </button>
      </div>

      {/* Pipeline overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(f => f === s ? '' : s)}
            className={`p-3 rounded-lg border text-center transition-all ${filter === s ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[s]}`}>{s}</span>
            <p className="text-lg font-bold text-gray-900 mt-1">{pipeline.find(p => p.status === s)?.count || 0}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text" value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
        placeholder="Search name, email, company..."
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none w-full sm:w-64"
      />

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => resetForm()}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">{editing ? 'Edit Lead' : 'New Lead'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Name *" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
                <Input label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} type="email" />
                <Input label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
                <Input label="Company" value={form.company} onChange={v => setForm({ ...form, company: v })} />
                <Input label="Source" value={form.source} onChange={v => setForm({ ...form, source: v })} placeholder="e.g., Website, Referral" />
                <Input label="Value (₹)" value={form.value} onChange={v => setForm({ ...form, value: v })} type="number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                  {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leads table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full" />
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No leads found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Source</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{l.name}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {l.email && <div>{l.email}</div>}
                      {l.phone && <div>{l.phone}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{l.company || '—'}</td>
                    <td className="px-4 py-3">
                      <select value={l.status} onChange={e => updateStatus(l.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${STATUS_COLORS[l.status] || 'bg-gray-100 text-gray-700'}`}>
                        {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{l.value ? `₹${Number(l.value).toLocaleString()}` : '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{l.source || '—'}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => openEdit(l)} className="text-orange-600 hover:text-orange-700 text-xs">Edit</button>
                      <button onClick={() => handleDelete(l.id)} className="text-red-500 hover:text-red-600 text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

function Input({ label, value, onChange, type = 'text', required, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" />
    </div>
  );
}

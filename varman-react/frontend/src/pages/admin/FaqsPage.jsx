import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function FaqsPage() {
  const { authFetch } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ question: '', answer: '', category: 'general' });

  useEffect(() => { loadFaqs(); }, []);

  const loadFaqs = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/admin/faqs');
      if (res.ok) { const d = await res.json(); setFaqs(d.faqs || []); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const resetForm = () => { setForm({ question: '', answer: '', category: 'general' }); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editing ? `/api/admin/faqs/${editing}` : '/api/admin/faqs';
      const method = editing ? 'PUT' : 'POST';
      const res = await authFetch(url, { method, body: JSON.stringify(form) });
      if (res.ok) { resetForm(); loadFaqs(); }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this FAQ?')) return;
    try { await authFetch(`/api/admin/faqs/${id}`, { method: 'DELETE' }); loadFaqs(); }
    catch (err) { console.error(err); }
  };

  const toggleActive = async (faq) => {
    try { await authFetch(`/api/admin/faqs/${faq.id}`, { method: 'PUT', body: JSON.stringify({ active: !faq.active }) }); loadFaqs(); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="text-sm text-gray-500">{faqs.length} questions</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-red-700 shadow">
          + Add FAQ
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => resetForm()}>
          <div className="bg-white rounded-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">{editing ? 'Edit FAQ' : 'New FAQ'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                <input type="text" value={form.question} required onChange={e => setForm({ ...form, question: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer *</label>
                <textarea value={form.answer} required onChange={e => setForm({ ...form, answer: e.target.value })}
                  rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                  <option value="general">General</option>
                  <option value="products">Products</option>
                  <option value="delivery">Delivery</option>
                  <option value="pricing">Pricing</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full" /></div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No FAQs yet</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {faqs.map(f => (
              <div key={f.id} className="px-5 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{f.question}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{f.answer}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{f.category || 'general'}</span>
                      <button onClick={() => toggleActive(f)}
                        className={`text-xs px-2 py-0.5 rounded-full ${f.active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {f.active !== false ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setForm({ question: f.question, answer: f.answer, category: f.category || 'general' }); setEditing(f.id); setShowForm(true); }}
                      className="text-orange-600 hover:text-orange-700 text-xs">Edit</button>
                    <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:text-red-600 text-xs">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

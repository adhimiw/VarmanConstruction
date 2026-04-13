import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ProductsPage() {
  const { authFetch } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ id: '', name: '', description: '', unit: '', image: '', icon: 'box', specifications: '', uses: '', advantages: '' });
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/admin/products');
      if (res.ok) { const d = await res.json(); setProducts(d.products || []); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ id: '', name: '', description: '', unit: '', image: '', icon: 'box', specifications: '', uses: '', advantages: '' });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (p) => {
    setForm({
      id: p.id, name: p.name, description: p.description || '', unit: p.unit || '',
      image: p.image || '', icon: p.icon || 'box',
      specifications: (p.specifications || []).join('\n'),
      uses: (p.uses || []).join('\n'),
      advantages: (p.advantages || []).join('\n'),
    });
    setEditing(p.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      ...form,
      specifications: form.specifications.split('\n').filter(Boolean),
      uses: form.uses.split('\n').filter(Boolean),
      advantages: form.advantages.split('\n').filter(Boolean),
    };
    try {
      const url = editing ? `/api/admin/products/${editing}` : '/api/admin/products';
      const method = editing ? 'PUT' : 'POST';
      const res = await authFetch(url, { method, body: JSON.stringify(body) });
      if (res.ok) { resetForm(); loadProducts(); }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await authFetch(`/api/admin/products/${id}`, { method: 'DELETE' }); loadProducts(); }
    catch (err) { console.error(err); }
  };

  const toggleActive = async (p) => {
    try {
      await authFetch(`/api/admin/products/${p.id}`, { method: 'PUT', body: JSON.stringify({ active: !p.active }) });
      loadProducts();
    } catch (err) { console.error(err); }
  };

  const handleImageUpload = async (file) => {
    if (!file || file.size > 5 * 1024 * 1024) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
        body: fd,
      });
      if (res.ok) {
        const d = await res.json();
        setForm(f => ({ ...f, image: d.path }));
      }
    } catch (err) { console.error(err); }
    finally { setUploading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{products.length} products</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-red-700 shadow">
          + Add Product
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => resetForm()}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">{editing ? 'Edit Product' : 'New Product'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product ID (unique)</label>
                  <input type="text" value={form.id} required
                    onChange={e => setForm({ ...form, id: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" placeholder="e.g., river_sand" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" value={form.name} required onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input type="text" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" placeholder="per cubic meter" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                {form.image && (
                  <div className="mb-2 relative inline-block">
                    <img src={form.image} alt="" className="w-24 h-24 object-cover rounded-lg border" onError={e => e.target.style.display = 'none'} />
                    <button type="button" onClick={() => setForm({ ...form, image: '' })} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs">×</button>
                  </div>
                )}
                <div
                  onDragEnter={e => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); setDragActive(false); handleImageUpload(e.dataTransfer.files[0]); }}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${dragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-400'}`}>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e.target.files[0])} />
                  {uploading ? <span className="text-sm text-gray-500">Uploading...</span> : <span className="text-sm text-gray-500">Click or drag image (max 5MB)</span>}
                </div>
                <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Or enter image path" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specifications (one per line)</label>
                <textarea value={form.specifications} onChange={e => setForm({ ...form, specifications: e.target.value })}
                  rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Uses (one per line)</label>
                <textarea value={form.uses} onChange={e => setForm({ ...form, uses: e.target.value })}
                  rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Advantages (one per line)</label>
                <textarea value={form.advantages} onChange={e => setForm({ ...form, advantages: e.target.value })}
                  rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full" /></div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No products yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Unit</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {p.image ? <img src={p.image} alt="" className="w-10 h-10 object-cover rounded" onError={e => e.target.style.display = 'none'} /> : <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">📦</div>}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.id}</td>
                    <td className="px-4 py-3 text-gray-600">{p.unit || '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(p)}
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${p.active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.active !== false ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => openEdit(p)} className="text-orange-600 hover:text-orange-700 text-xs">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-600 text-xs">Delete</button>
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

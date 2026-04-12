import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function MediaPage() {
  const { authFetch } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => { loadImages(); }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/admin/images');
      if (res.ok) { const d = await res.json(); setImages(d.images || []); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleUpload = async (file) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!file || !allowed.includes(file.type) || file.size > 5 * 1024 * 1024) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
        body: fd,
      });
      if (res.ok) loadImages();
    } catch (err) { console.error(err); }
    finally { setUploading(false); }
  };

  const handleDelete = async (filename) => {
    if (!confirm('Delete this image?')) return;
    try { await authFetch(`/api/admin/upload/${filename}`, { method: 'DELETE' }); loadImages(); }
    catch (err) { console.error(err); }
  };

  const copyPath = (path) => {
    navigator.clipboard?.writeText(path);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <p className="text-sm text-gray-500">{images.length} images</p>
      </div>

      {/* Upload zone */}
      <div
        onDragEnter={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) handleUpload(e.dataTransfer.files[0]); }}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-400 bg-white'
        }`}>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files[0]) handleUpload(e.target.files[0]); }} />
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mb-2" />
            <p className="text-gray-500">Uploading...</p>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-2">📷</div>
            <p className="font-medium text-gray-700">Click or drag image to upload</p>
            <p className="text-sm text-gray-400 mt-1">JPEG, PNG, WebP, GIF &bull; Max 5MB</p>
          </>
        )}
      </div>

      {/* Gallery grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full" /></div>
      ) : images.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">No images uploaded yet</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img, i) => {
            const path = typeof img === 'string' ? img : img.path || img.url;
            const filename = path?.split('/').pop() || '';
            return (
              <div key={i} className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square">
                  <img src={path} alt={filename} className="w-full h-full object-cover" onError={e => e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f3f4f6" width="100" height="100"/><text fill="%239ca3af" x="50" y="55" text-anchor="middle" font-size="12">Error</text></svg>'} />
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">{filename}</p>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => copyPath(path)} className="px-3 py-1.5 bg-white text-gray-900 text-xs rounded-lg hover:bg-gray-100 font-medium">Copy Path</button>
                  <button onClick={() => handleDelete(filename)} className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 font-medium">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

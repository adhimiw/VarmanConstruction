import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ContactsPage() {
  const { authFetch } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => { loadContacts(); }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/admin/contacts');
      if (res.ok) { const d = await res.json(); setContacts(d.contacts || []); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const markRead = async (id) => {
    try { await authFetch(`/api/admin/contacts/${id}`, { method: 'PUT', body: JSON.stringify({ read: true }) }); loadContacts(); }
    catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact?')) return;
    try { await authFetch(`/api/admin/contacts/${id}`, { method: 'DELETE' }); setSelected(null); loadContacts(); }
    catch (err) { console.error(err); }
  };

  const unread = contacts.filter(c => !c.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        <p className="text-sm text-gray-500">{contacts.length} total &bull; {unread} unread</p>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Contact Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-500">Name:</span> <span className="font-medium">{selected.name}</span></div>
              <div><span className="text-gray-500">Email:</span> <span className="font-medium">{selected.email}</span></div>
              {selected.phone && <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{selected.phone}</span></div>}
              {selected.material && selected.material !== 'Not specified' && <div><span className="text-gray-500">Material:</span> <span className="font-medium">{selected.material}</span></div>}
              {selected.project_location && selected.project_location !== 'Not specified' && <div><span className="text-gray-500">Location:</span> <span className="font-medium">{selected.project_location}</span></div>}
              <div>
                <span className="text-gray-500">Message:</span>
                <p className="mt-1 bg-gray-50 rounded p-3 text-gray-700">{selected.message || '—'}</p>
              </div>
              <div className="text-xs text-gray-400">{selected.created_at ? new Date(selected.created_at).toLocaleString() : ''}</div>
            </div>
            <div className="flex gap-2 mt-4">
              {selected.email && (
                <a href={`mailto:${selected.email}`} className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700">Reply via Email</a>
              )}
              <button onClick={() => handleDelete(selected.id)} className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full" /></div>
        ) : contacts.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No contact submissions yet</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {contacts.map(c => (
              <div key={c.id} className={`px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3 ${!c.read ? 'bg-orange-50/50' : ''}`}
                onClick={() => { setSelected(c); if (!c.read) markRead(c.id); }}>
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!c.read ? 'bg-orange-500' : 'bg-transparent'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${!c.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>{c.name}</span>
                    <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}</span>
                  </div>
                  {c.material && c.material !== 'Not specified' && <p className="text-sm text-gray-600 truncate">{c.material}</p>}
                  <p className="text-xs text-gray-400 truncate">{c.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

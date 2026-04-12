import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { authFetch } = useAuth();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/admin/cms/settings');
      if (res.ok) {
        const data = await res.json();
        // Convert array of {key,value,group} to grouped object
        const grouped = {};
        (data.settings || []).forEach(s => {
          if (!grouped[s.group || 'general']) grouped[s.group || 'general'] = {};
          grouped[s.group || 'general'][s.key] = s.value;
        });
        setSettings(grouped);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Flatten grouped settings back to array
      const flat = {};
      Object.entries(settings).forEach(([group, kvs]) => {
        Object.entries(kvs).forEach(([key, value]) => {
          flat[key] = value;
        });
      });
      const res = await authFetch('/api/admin/cms/settings', { method: 'PUT', body: JSON.stringify({ settings: flat }) });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const updateSetting = (group, key, value) => {
    setSettings(prev => ({
      ...prev,
      [group]: { ...prev[group], [key]: value },
    }));
  };

  // Default settings structure when no settings exist
  const defaultGroups = {
    general: {
      site_name: 'Varman Construction',
      site_tagline: 'Quality Building Materials Supplier',
      site_email: '',
      site_phone: '',
      site_address: '',
    },
    seo: {
      meta_title: '',
      meta_description: '',
      google_analytics_id: '',
    },
    social: {
      whatsapp_number: '',
      facebook_url: '',
      instagram_url: '',
      youtube_url: '',
    },
    appearance: {
      primary_color: '#f97316',
      secondary_color: '#ef4444',
      logo_url: '',
      favicon_url: '',
    },
  };

  const groups = Object.keys(settings).length > 0 ? settings : defaultGroups;

  if (loading) return (
    <div className="flex items-center justify-center h-48"><div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full" /></div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Configure your site and CMS</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-red-700 disabled:opacity-50 shadow">
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>

      {Object.entries(groups).map(([group, fields]) => (
        <div key={group} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-900 capitalize">{group} Settings</h3>
          </div>
          <div className="p-5 space-y-4">
            {Object.entries(fields).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key.replace(/_/g, ' ')}
                </label>
                {key.includes('color') ? (
                  <div className="flex items-center gap-3">
                    <input type="color" value={value || '#f97316'}
                      onChange={e => updateSetting(group, key, e.target.value)}
                      className="w-10 h-10 rounded border border-gray-300 cursor-pointer" />
                    <input type="text" value={value || ''}
                      onChange={e => updateSetting(group, key, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                ) : key.includes('description') || key.includes('address') ? (
                  <textarea value={value || ''} onChange={e => updateSetting(group, key, e.target.value)}
                    rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                ) : (
                  <input type="text" value={value || ''} onChange={e => updateSetting(group, key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

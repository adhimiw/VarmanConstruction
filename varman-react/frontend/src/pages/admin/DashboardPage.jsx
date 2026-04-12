import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

function StatCard({ label, value, icon, color = 'orange', change }) {
  const colors = {
    orange: 'from-orange-500 to-red-600',
    green: 'from-emerald-500 to-teal-600',
    blue: 'from-cyan-500 to-blue-600',
    purple: 'from-violet-500 to-purple-600',
    pink: 'from-pink-500 to-rose-600',
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value ?? '—'}</p>
          {change !== undefined && (
            <p className={`text-xs mt-1 ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last week
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg`}>
          <span className="text-white text-lg">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function MiniTable({ title, headers, rows, emptyMsg }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      {rows.length === 0 ? (
        <div className="p-8 text-center text-gray-400 text-sm">{emptyMsg || 'No data yet'}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { authFetch } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, cmsRes] = await Promise.all([
        authFetch('/api/admin/stats'),
        authFetch('/api/admin/cms/dashboard'),
      ]);
      const stats = statsRes.ok ? await statsRes.json() : {};
      const cms = cmsRes.ok ? await cmsRes.json() : {};
      setData({ ...stats, cms });
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
    </div>
  );

  const s = data || {};
  const cms = s.cms || {};
  const counts = cms.counts || {};

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your site and business</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Products" value={s.products ?? counts.products} icon="📦" color="orange" />
        <StatCard label="Contacts" value={s.totalContacts ?? counts.contacts} icon="✉️" color="green" />
        <StatCard label="Quotes" value={s.totalQuotes ?? counts.quotes} icon="📋" color="blue" />
        <StatCard label="Total Visitors" value={counts.visitors || s.analytics?.views || 0} icon="👁️" color="purple" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Leads" value={counts.leads || 0} icon="🎯" color="pink" />
        <StatCard label="CMS Pages" value={counts.pages || 0} icon="📄" color="blue" />
        <StatCard label="FAQs" value={s.faqs ?? counts.faqs} icon="❓" color="green" />
        <StatCard label="Unread Notifications" value={counts.unread_notifications || 0} icon="🔔" color="orange" />
      </div>

      {/* Visitor trends chart placeholder */}
      {cms.visitor_trend && cms.visitor_trend.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Visitor Trends (Last 30 Days)</h3>
          <div className="flex items-end gap-1 h-32">
            {cms.visitor_trend.map((d, i) => {
              const max = Math.max(...cms.visitor_trend.map(t => t.count), 1);
              const h = (d.count / max) * 100;
              return (
                <div key={i} className="flex-1 group relative">
                  <div
                    className="bg-gradient-to-t from-orange-500 to-orange-300 rounded-t hover:from-orange-600 hover:to-orange-400 transition-colors cursor-pointer"
                    style={{ height: `${Math.max(h, 4)}%` }}
                  />
                  <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    {d.date}: {d.count} visits
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>{cms.visitor_trend[0]?.date}</span>
            <span>{cms.visitor_trend[cms.visitor_trend.length - 1]?.date}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent contacts */}
        <MiniTable
          title="Recent Contacts"
          headers={['Name', 'Material', 'Date']}
          emptyMsg="No contacts yet"
          rows={(cms.recent_contacts || []).slice(0, 5).map((c, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
              <td className="px-4 py-3 text-gray-600">{c.material || '—'}</td>
              <td className="px-4 py-3 text-gray-400 text-xs">{c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</td>
            </tr>
          ))}
        />

        {/* Recent activity */}
        <MiniTable
          title="Recent Activity"
          headers={['Action', 'User', 'Time']}
          emptyMsg="No activity yet"
          rows={(cms.recent_activity || []).slice(0, 5).map((a, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-900">{a.action}{a.description ? ` — ${a.description}` : ''}</td>
              <td className="px-4 py-3 text-gray-600">{a.admin_username || 'System'}</td>
              <td className="px-4 py-3 text-gray-400 text-xs">{a.created_at ? new Date(a.created_at).toLocaleString() : '—'}</td>
            </tr>
          ))}
        />
      </div>

      {/* Recent quotes & country breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MiniTable
          title="Recent Quotes"
          headers={['Name', 'Materials', 'Status', 'Date']}
          emptyMsg="No quotes yet"
          rows={(cms.recent_quotes || []).slice(0, 5).map((q, i) => {
            let materials = '';
            try {
              const parsed = typeof q.materials === 'string' ? JSON.parse(q.materials) : q.materials;
              materials = Array.isArray(parsed) ? parsed.join(', ') : String(parsed);
            } catch { materials = q.materials || '—'; }
            return (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{q.name}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{materials}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    q.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    q.status === 'approved' ? 'bg-green-100 text-green-700' :
                    q.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{q.status || '—'}</span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{q.created_at ? new Date(q.created_at).toLocaleDateString() : '—'}</td>
              </tr>
            );
          })}
        />

        {cms.country_breakdown && cms.country_breakdown.length > 0 && (
          <MiniTable
            title="Top Countries"
            headers={['Country', 'Visitors']}
            rows={cms.country_breakdown.map((c, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">{c.country_code ? `${c.country_code} ` : ''}{c.country}</td>
                <td className="px-4 py-3 text-gray-600">{c.count}</td>
              </tr>
            ))}
          />
        )}
      </div>

      {/* Device / Browser breakdown */}
      {(cms.device_breakdown || cms.browser_breakdown) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cms.device_breakdown && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Device Breakdown</h3>
              <div className="space-y-2">
                {cms.device_breakdown.map((d, i) => {
                  const total = cms.device_breakdown.reduce((s, x) => s + x.count, 0) || 1;
                  const pct = ((d.count / total) * 100).toFixed(1);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-20">{d.device_type || 'Unknown'}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-12 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {cms.browser_breakdown && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Browser Breakdown</h3>
              <div className="space-y-2">
                {cms.browser_breakdown.map((b, i) => {
                  const total = cms.browser_breakdown.reduce((s, x) => s + x.count, 0) || 1;
                  const pct = ((b.count / total) * 100).toFixed(1);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-20">{b.browser || 'Unknown'}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-12 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top pages */}
      {cms.top_pages && cms.top_pages.length > 0 && (
        <MiniTable
          title="Top Pages"
          headers={['Page', 'Views']}
          rows={cms.top_pages.map((p, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-900 font-mono text-xs">{p.path || p.page_url}</td>
              <td className="px-4 py-3 text-gray-600">{p.views}</td>
            </tr>
          ))}
        />
      )}
    </div>
  );
}

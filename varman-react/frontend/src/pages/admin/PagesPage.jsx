import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

const COMPONENTS = [
  {
    key: 'header',
    label: 'Header & Navigation',
    icon: 'M3 3h18v4H3V3zm0 7h18v4H3v-4zm0 7h18v4H3v-4z',
    description: 'Logo, phone numbers, navigation links, WhatsApp button',
    fields: [
      { name: 'phone_primary', label: 'Primary Phone', type: 'text', placeholder: '+91 77084 84811' },
      { name: 'phone_secondary', label: 'Secondary Phone', type: 'text', placeholder: '+91 99652 37777' },
      { name: 'whatsapp_number', label: 'WhatsApp Number', type: 'text', placeholder: '917708484811' },
      { name: 'whatsapp_message', label: 'WhatsApp Default Message', type: 'textarea', placeholder: "Hi! I'm interested in building materials..." },
      { name: 'gstin', label: 'GSTIN Number', type: 'text', placeholder: '33BTGPM9877H1Z3' },
      { name: 'nav_items', label: 'Navigation Items (comma-separated)', type: 'text', placeholder: 'Home, Products, About, FAQ, Contact' },
    ],
  },
  {
    key: 'hero',
    label: 'Hero Section',
    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z',
    description: 'Main headline, subheadline, trust badge, CTA buttons, stats',
    fields: [
      { name: 'trust_badge', label: 'Trust Badge Text', type: 'text', placeholder: 'Trusted by 500+ Contractors Since 2020' },
      { name: 'headline', label: 'Main Headline', type: 'text', placeholder: 'Premium Building Materials Supplier Across Tamil Nadu' },
      { name: 'subheadline', label: 'Sub Headline', type: 'textarea', placeholder: 'M-Sand, Blue Metal, Cement, Bricks...' },
      { name: 'check_1', label: 'Checkmark 1', type: 'text', placeholder: 'Quality Certified' },
      { name: 'check_2', label: 'Checkmark 2', type: 'text', placeholder: '24-48hr Delivery' },
      { name: 'check_3', label: 'Checkmark 3', type: 'text', placeholder: 'Best Prices' },
      { name: 'cta_primary', label: 'Primary CTA Text', type: 'text', placeholder: 'Get Free Quote' },
      { name: 'cta_secondary', label: 'Secondary CTA Text', type: 'text', placeholder: 'WhatsApp Us' },
      { name: 'social_proof', label: 'Social Proof Text', type: 'text', placeholder: 'Rated 4.9/5 by 200+ customers' },
    ],
  },
  {
    key: 'services',
    label: 'Products Section',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    description: 'Section title, subtitle, and product display settings',
    fields: [
      { name: 'section_badge', label: 'Section Badge', type: 'text', placeholder: 'Our Products' },
      { name: 'section_title', label: 'Section Title', type: 'text', placeholder: 'Premium Building Materials' },
      { name: 'section_subtitle', label: 'Section Subtitle', type: 'textarea', placeholder: 'We supply a comprehensive range of construction materials...' },
      { name: 'cta_text', label: 'Bottom CTA Text', type: 'text', placeholder: 'Need Custom Quantities?' },
      { name: 'cta_button', label: 'CTA Button Text', type: 'text', placeholder: 'Get a Custom Quote' },
    ],
  },
  {
    key: 'about',
    label: 'About Section',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    description: 'Company info, stats, features, mission & vision',
    fields: [
      { name: 'company_name', label: 'Company Name', type: 'text', placeholder: 'VARMAN CONSTRUCTIONS' },
      { name: 'established_year', label: 'Established Year', type: 'text', placeholder: '2020' },
      { name: 'description_1', label: 'Description Paragraph 1', type: 'textarea', placeholder: 'We are committed to providing the highest quality building materials...' },
      { name: 'description_2', label: 'Description Paragraph 2', type: 'textarea', placeholder: 'From M-Sand to AAC Blocks...' },
      { name: 'stat_projects', label: 'Projects Count', type: 'text', placeholder: '200+' },
      { name: 'stat_states', label: 'States Covered', type: 'text', placeholder: '3+' },
      { name: 'stat_years', label: 'Years Experience', type: 'text', placeholder: '5+' },
      { name: 'mission', label: 'Mission Statement', type: 'textarea', placeholder: 'To supply the best construction materials...' },
      { name: 'vision', label: 'Vision Statement', type: 'textarea', placeholder: 'To become the most trusted...' },
      { name: 'email', label: 'Contact Email', type: 'text', placeholder: 'info@varmanconstructions.in' },
      { name: 'phone', label: 'Contact Phone', type: 'text', placeholder: '+91 77084 84811' },
    ],
  },
  {
    key: 'faq',
    label: 'FAQ Section',
    icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    description: 'Section title, subtitle (FAQ items managed in FAQs page)',
    fields: [
      { name: 'section_badge', label: 'Section Badge', type: 'text', placeholder: 'FAQ' },
      { name: 'section_title', label: 'Section Title', type: 'text', placeholder: 'Frequently Asked Questions' },
      { name: 'section_subtitle', label: 'Section Subtitle', type: 'textarea', placeholder: 'Find answers to common questions about our products and services' },
    ],
  },
  {
    key: 'contact',
    label: 'Contact Section',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    description: 'Contact form settings, phone, email, working hours',
    fields: [
      { name: 'section_badge', label: 'Section Badge', type: 'text', placeholder: 'Contact Us' },
      { name: 'section_title', label: 'Section Title', type: 'text', placeholder: 'Get In Touch' },
      { name: 'phone_primary', label: 'Primary Phone', type: 'text', placeholder: '+91 77084 84811' },
      { name: 'phone_secondary', label: 'Secondary Phone', type: 'text', placeholder: '+91 99652 37777' },
      { name: 'email', label: 'Email Address', type: 'text', placeholder: 'info@varmanconstructions.in' },
      { name: 'whatsapp_number', label: 'WhatsApp Number', type: 'text', placeholder: '917708484811' },
      { name: 'address_line1', label: 'Address Line 1', type: 'text', placeholder: 'Varman Constructions' },
      { name: 'address_line2', label: 'Address Landmark', type: 'text', placeholder: 'Near HP Petrol Bunk' },
      { name: 'address_line3', label: 'Address City & Pincode', type: 'text', placeholder: 'Porulur - 624616' },
      { name: 'working_hours', label: 'Working Hours', type: 'text', placeholder: 'Mon - Sat: 8:00 AM - 8:00 PM' },
      { name: 'established_text', label: 'Established Text', type: 'text', placeholder: 'Est. 2020 - 5+ Years' },
      { name: 'form_success_message', label: 'Form Success Message', type: 'textarea', placeholder: 'Thank you! We will contact you shortly.' },
      { name: 'materials_list', label: 'Materials Dropdown (comma-separated)', type: 'textarea', placeholder: 'M-Sand, P-Sand, Blue Metal 12mm, Blue Metal 20mm, Blue Metal 40mm, Red Bricks, Fly Ash Bricks, Concrete Blocks, AAC Blocks, Cement, Size Stone, Other' },
    ],
  },
  {
    key: 'seo',
    label: 'SEO & Meta Tags',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    description: 'Page title, meta description, Open Graph tags',
    fields: [
      { name: 'page_title', label: 'Page Title', type: 'text', placeholder: 'VARMAN CONSTRUCTIONS - #1 Building Materials Supplier' },
      { name: 'meta_description', label: 'Meta Description', type: 'textarea', placeholder: "Tamil Nadu's trusted building materials supplier..." },
      { name: 'meta_keywords', label: 'Meta Keywords', type: 'textarea', placeholder: 'building materials, M-Sand, Blue Metal...' },
      { name: 'og_title', label: 'Open Graph Title', type: 'text', placeholder: 'VARMAN CONSTRUCTIONS' },
      { name: 'og_description', label: 'OG Description', type: 'textarea', placeholder: 'Premium building materials supplier' },
      { name: 'canonical_url', label: 'Canonical URL', type: 'text', placeholder: 'https://varmanconstructions.in/' },
    ],
  },
];

export default function PagesPage() {
  const { authFetch } = useAuth();
  const [activeSection, setActiveSection] = useState('header');
  const [componentData, setComponentData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const loadComponents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/admin/cms/components');
      if (res.ok) {
        const d = await res.json();
        setComponentData(d.components || {});
        setOriginalData(d.components || {});
      }
    } catch (err) {
      console.error('Failed to load components:', err);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => { loadComponents(); }, [loadComponents]);

  const handleFieldChange = (componentKey, fieldName, value) => {
    setComponentData(prev => ({
      ...prev,
      [componentKey]: {
        ...(prev[componentKey] || {}),
        [fieldName]: value,
      },
    }));
  };

  const hasChanges = (componentKey) => {
    const current = componentData[componentKey] || {};
    const original = originalData[componentKey] || {};
    return JSON.stringify(current) !== JSON.stringify(original);
  };

  const handleSave = async (componentKey) => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await authFetch('/api/admin/cms/components', {
        method: 'POST',
        body: JSON.stringify({
          component: componentKey,
          data: componentData[componentKey] || {},
        }),
      });
      if (res.ok) {
        setOriginalData(prev => ({ ...prev, [componentKey]: { ...(componentData[componentKey] || {}) } }));
        setSaveStatus({ type: 'success', message: 'Saved successfully!' });
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus({ type: 'error', message: 'Failed to save. Please try again.' });
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = (componentKey) => {
    setComponentData(prev => ({
      ...prev,
      [componentKey]: { ...(originalData[componentKey] || {}) },
    }));
  };

  const activeComponent = COMPONENTS.find(c => c.key === activeSection);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Editor</h1>
        <p className="text-sm text-gray-500 mt-1">Edit each section of your website. Changes are saved per component.</p>
      </div>

      {/* Save Status Toast */}
      {saveStatus && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
          saveStatus.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {saveStatus.message}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Component List */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-4">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Components</h3>
            </div>
            <nav className="p-2 space-y-1">
              {COMPONENTS.map(comp => (
                <button
                  key={comp.key}
                  onClick={() => setActiveSection(comp.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all text-sm ${
                    activeSection === comp.key
                      ? 'bg-orange-50 text-orange-700 font-medium border border-orange-200'
                      : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={comp.icon} />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{comp.label}</div>
                  </div>
                  {hasChanges(comp.key) && (
                    <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" title="Unsaved changes" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Editor Panel */}
        <div className="flex-1 min-w-0">
          {activeComponent && (
            <div className="bg-white rounded-xl border border-gray-200">
              {/* Component Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{activeComponent.label}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{activeComponent.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {hasChanges(activeComponent.key) && (
                    <button
                      onClick={() => handleReset(activeComponent.key)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    onClick={() => handleSave(activeComponent.key)}
                    disabled={saving || !hasChanges(activeComponent.key)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      hasChanges(activeComponent.key)
                        ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-sm'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </div>

              {/* Fields */}
              <div className="p-6 space-y-5">
                {activeComponent.fields.map(field => {
                  const value = (componentData[activeComponent.key] || {})[field.name] || '';
                  const originalValue = (originalData[activeComponent.key] || {})[field.name] || '';
                  const isModified = value !== originalValue;

                  return (
                    <div key={field.name} className="group">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                        {field.label}
                        {isModified && (
                          <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-600">
                            Modified
                          </span>
                        )}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={value}
                          onChange={e => handleFieldChange(activeComponent.key, field.name, e.target.value)}
                          placeholder={field.placeholder}
                          rows={3}
                          className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
                            isModified ? 'border-orange-300 bg-orange-50/30' : 'border-gray-300'
                          }`}
                        />
                      ) : (
                        <input
                          type="text"
                          value={value}
                          onChange={e => handleFieldChange(activeComponent.key, field.name, e.target.value)}
                          placeholder={field.placeholder}
                          className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
                            isModified ? 'border-orange-300 bg-orange-50/30' : 'border-gray-300'
                          }`}
                        />
                      )}
                      {field.placeholder && !value && (
                        <p className="mt-1 text-xs text-gray-400">Default: {field.placeholder}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Footer Actions */}
              {hasChanges(activeComponent.key) && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex items-center justify-between">
                  <p className="text-xs text-amber-600 font-medium">You have unsaved changes</p>
                  <button
                    onClick={() => handleSave(activeComponent.key)}
                    disabled={saving}
                    className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 shadow-sm transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

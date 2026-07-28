import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { adminService } from '../../api/services';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'MobiMart',
    supportEmail: 'support@mobimart.com',
    freeShippingThreshold: 1000,
    enableCod: true
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSettings();
      if (res.data?.data) {
        setSettings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminService.updateSettings(settings);
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Failed to save settings', err);
      alert('Save failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-10 text-center text-sm font-bold text-gray-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage global store configurations and policies.</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-[var(--shadow-soft-ui)] overflow-hidden">
        
        <div className="p-6 border-b border-neutral-100">
          <h2 className="text-lg font-bold text-neutral-900">General Settings</h2>
          <p className="text-sm text-neutral-500 mb-6">Configure basic store information.</p>
          
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Store Name</label>
              <input 
                type="text" 
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-gold-accent focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Support Email</label>
              <input 
                type="email" 
                name="supportEmail"
                value={settings.supportEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-gold-accent focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-neutral-100">
          <h2 className="text-lg font-bold text-neutral-900">Order & Shipping</h2>
          <p className="text-sm text-neutral-500 mb-6">Configure shipping rules and fees.</p>
          
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Free Shipping Threshold (₹)</label>
              <input 
                type="number" 
                name="freeShippingThreshold"
                value={settings.freeShippingThreshold}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-gold-accent focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl bg-neutral-50/50">
              <div>
                <h3 className="text-sm font-medium text-neutral-900">Enable Cash on Delivery (COD)</h3>
                <p className="text-xs text-neutral-500">Allow customers to pay upon delivery.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="enableCod"
                  checked={settings.enableCod}
                  onChange={handleChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-accent"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 bg-neutral-50 flex justify-end gap-3">
          <button 
            onClick={fetchSettings}
            className="px-5 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-200 bg-neutral-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </div>

    </div>
  );
};

export default AdminSettings;

import React from 'react';

const BasicInfoSection = ({ data, updateField }) => {
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
        <p className="text-sm text-gray-500 mt-1">Primary details that identify this product.</p>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm placeholder:text-gray-400"
            placeholder="e.g. iPhone 15 Pro Max"
            value={data.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm placeholder:text-gray-400"
            placeholder="e.g. apple-iphone-15-pro-max"
            value={data.slug || ''}
            onChange={(e) => updateField('slug', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Long Description</label>
          <textarea
            rows={8}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm placeholder:text-gray-400"
            placeholder="Detailed product information, features, and marketing copy..."
            value={data.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;

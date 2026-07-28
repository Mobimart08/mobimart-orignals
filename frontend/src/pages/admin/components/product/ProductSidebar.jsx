import React from 'react';

const ProductSidebar = ({ data, updateField }) => {
  return (
    <div className="space-y-6">
      
      {/* Product Status */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Product Status</h2>
        </div>
        <div className="p-5">
          <select
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm bg-white font-medium"
            value={data.status || 'Draft'}
            onChange={(e) => updateField('status', e.target.value)}
          >
            <option value="Published">🟢 Published (Live)</option>
            <option value="Draft">🟡 Draft (Hidden)</option>
            <option value="Hidden">🟠 Hidden (Direct Link Only)</option>
            <option value="Archived">🔴 Archived</option>
          </select>
          
          <p className="text-xs text-gray-500 mt-3 leading-relaxed">
            This product will be visible across your sales channels based on this status.
          </p>
        </div>
      </div>

      {/* Visibility */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Visibility & Collections</h2>
        </div>
        <div className="p-5 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="pt-0.5">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500 cursor-pointer"
                checked={data.isFeatured || false}
                onChange={(e) => updateField('isFeatured', e.target.checked)}
              />
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-900 group-hover:text-amber-700 transition-colors">Featured Product</span>
              <span className="block text-xs text-gray-500 mt-0.5">Show on homepage and featured collections.</span>
            </div>
          </label>
        </div>
      </div>

    </div>
  );
};

export default ProductSidebar;

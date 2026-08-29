import React from 'react';

const PricingSection = ({ data, updateField }) => {
  const sellingPrice = parseFloat(data.price) || 0;
  

  const handleNumericKeyDown = (e) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>
        <p className="text-sm text-gray-500 mt-1">Determine how much you charge and measure profitability.</p>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹) *</label>
            <input
              type="number"
              min="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
              placeholder="e.g. 89999"
              value={data.price || ''}
              onChange={(e) => updateField('price', e.target.value)}
              onKeyDown={handleNumericKeyDown}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Charge (₹)</label>
            <input
              type="number"
              min="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
              placeholder="e.g. 99 (0 for Free)"
              value={data.deliveryCharge || ''}
              onChange={(e) => updateField('deliveryCharge', e.target.value)}
              onKeyDown={handleNumericKeyDown}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;

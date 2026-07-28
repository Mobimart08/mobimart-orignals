import React from 'react';

const InventorySection = ({ data, updateField }) => {
  const handleNumericKeyDown = (e) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-lg font-semibold text-gray-900">Inventory</h2>
        <p className="text-sm text-gray-500 mt-1">Manage stock levels and availability.</p>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Stock *</label>
            <input
              type="number"
              min="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
              placeholder="e.g. 50"
              value={data.stock || ''}
              onChange={(e) => updateField('stock', e.target.value)}
              onKeyDown={handleNumericKeyDown}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Inventory Availability</label>
          <select
            className="w-full md:w-1/3 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm bg-white"
            value={data.availabilityStatus || 'Active'}
            onChange={(e) => updateField('availabilityStatus', e.target.value)}
          >
            <option value="Active">Active / In Stock</option>
            <option value="Draft">Draft (Do not track)</option>
            <option value="Out Of Stock">Out Of Stock</option>
            <option value="Upcoming">Upcoming (Pre-order)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default InventorySection;

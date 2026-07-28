import React, { useEffect, useState } from 'react';
import { brandService, categoryService } from '../../../../api/services';

const BrandCategorySection = ({ data, updateField }) => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandRes, catRes] = await Promise.all([
          brandService.getAll(),
          categoryService.getAll()
        ]);
        setBrands(brandRes.data?.data || []);
        setCategories(catRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load brands/categories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-lg font-semibold text-gray-900">Brand & Category</h2>
        <p className="text-sm text-gray-500 mt-1">Organize the product in your catalog.</p>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm bg-white"
              value={data.brand || ''}
              onChange={(e) => updateField('brand', e.target.value)}
              disabled={loading}
            >
              <option value="">Select a brand...</option>
              {brands.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm bg-white"
              value={data.category || ''}
              onChange={(e) => updateField('category', e.target.value)}
              disabled={loading}
            >
              <option value="">Select a category...</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['New', 'Open Box', 'Refurbished', 'Used'].map(condition => (
              <label 
                key={condition} 
                className={`flex items-center justify-center px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                  data.productCondition === condition 
                    ? 'border-amber-600 bg-amber-50 text-amber-800 shadow-[0_0_0_1px_rgba(217,119,6,0.3)]' 
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="productCondition"
                  value={condition}
                  checked={data.productCondition === condition}
                  onChange={(e) => updateField('productCondition', e.target.value)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{condition}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCategorySection;

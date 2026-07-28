import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/admin/DataTable';
import { Plus, Search, X, Pencil, Power, Trash2 } from 'lucide-react';
import { adminService, brandService, categoryService, productsService } from '../../api/services';
import ImageManager from '../../components/admin/ImageManager';

const PRODUCT_CONDITIONS = ['New', 'Refurbished', 'Used', 'Open Box'];
const STOCK_FILTERS = [
  { value: '', label: 'All Stock' },
  { value: 'in_stock', label: 'In Stock' },
  { value: 'low_stock', label: 'Low Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
];
const STATUS_FILTERS = [
  { value: '', label: 'All Status' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

const emptyBrandForm = {
  name: '',
  description: '',
  sortOrder: 0,
  isActive: true,
};

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);


  const [brandForm, setBrandForm] = useState(emptyBrandForm);
  const [editingBrandId, setEditingBrandId] = useState(null);

  const [filters, setFilters] = useState({
    q: '',
    brand: '',
    category: '',
    productCondition: '',
    stockStatus: '',
    status: '',
    minPrice: '',
    maxPrice: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [brandSaving, setBrandSaving] = useState(false);

  const fetchMetadata = async () => {
    const [brandRes, catRes] = await Promise.all([
      adminService.getBrands(),
      adminService.getCategories(),
    ]);
    setBrands(brandRes.data?.data || []);
    setCategories(catRes.data?.data || []);
  };

  const fetchProducts = async () => {
    setFetching(true);
    try {
      const cleanedParams = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '' && value !== null && value !== undefined)
      );
      const res = await adminService.getProducts({ ...cleanedParams, limit: 100 });
      setProducts(res.data?.data?.data || []);
      setPagination(res.data?.data?.pagination || null);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setFetching(false);
    }
  };

  const fetchInitialData = async () => {
    try {
      await Promise.all([fetchMetadata(), fetchProducts()]);
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters.q, filters.brand, filters.category, filters.productCondition, filters.stockStatus, filters.status, filters.minPrice, filters.maxPrice]);

  const activeBrands = useMemo(() => brands.filter((brand) => brand.isActive), [brands]);

  const handleOpenModal = (product = null) => {
    if (product) {
      navigate(`/admin/products/${product._id || product.id}/edit`);
    } else {
      navigate('/admin/products/new');
    }
  };

  const resetBrandEditor = () => {
    setEditingBrandId(null);
    setBrandForm(emptyBrandForm);
  };

  const handleEditBrand = (brand) => {
    setEditingBrandId(brand._id);
    setBrandForm({
      name: brand.name || '',
      description: brand.description || '',
      sortOrder: brand.sortOrder || 0,
      isActive: brand.isActive !== false,
    });
  };

  const handleDelete = async (row) => {
    if (!window.confirm('Are you sure you want to move this product out of the published catalog?')) return;
    try {
      await productsService.delete(row.id);
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete', err);
      alert('Delete failed.');
    }
  };

  const handleSaveBrand = async (e) => {
    e.preventDefault();
    setBrandSaving(true);
    try {
      const payload = {
        name: brandForm.name.trim(),
        description: brandForm.description.trim() || null,
        sortOrder: Number(brandForm.sortOrder) || 0,
        isActive: Boolean(brandForm.isActive),
      };

      if (editingBrandId) {
        await brandService.update(editingBrandId, payload);
      } else {
        await brandService.create(payload);
      }

      resetBrandEditor();
      await fetchMetadata();
    } catch (err) {
      console.error('Brand save failed', err);
      alert(err.response?.data?.message || 'Failed to save brand');
    } finally {
      setBrandSaving(false);
    }
  };

  const handleToggleBrand = async (brand) => {
    try {
      await brandService.update(brand._id, { ...brand, isActive: !brand.isActive });
      await fetchMetadata();
    } catch (err) {
      console.error('Brand toggle failed', err);
      alert(err.response?.data?.message || 'Failed to update brand');
    }
  };

  const handleDeleteBrand = async (brand) => {
    if (!window.confirm(`Delete brand ${brand.name}?`)) return;
    try {
      await brandService.delete(brand._id);
      if (editingBrandId === brand._id) {
        resetBrandEditor();
      }
      await fetchMetadata();
    } catch (err) {
      console.error('Brand delete failed', err);
      alert(err.response?.data?.message || 'Failed to delete brand');
    }
  };



  const tableData = products.map((product) => ({
    id: product._id || product.id,
    image: product.images?.[0]?.url || 'https://via.placeholder.com/150',
    name: product.name,
    sku: product.sku || 'Pending SKU',
    brand: product.brand?.name || product.brandName || product.brand,
    category: product.category?.name || product.categoryName || product.category,
    productCondition: product.productCondition || product.conditionType || 'New',
    price: typeof product.price === 'number' ? `₹ ${product.price.toLocaleString('en-IN')}` : product.price,
    stock: product.stock ?? 0,
    status: product.isActive ? 'Published' : 'Draft',
    originalData: product,
  }));

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      render: (name, row) => (
        <div className="flex items-center gap-3">
          <img src={row.image} alt={name} className="w-10 h-10 rounded-lg object-cover bg-neutral-50 border border-neutral-100" />
          <div>
            <div className="font-medium text-neutral-900 line-clamp-1">{name}</div>
            <div className="text-xs text-neutral-500">{row.brand} � {row.sku}</div>
          </div>
        </div>
      ),
    },
    { header: 'Category', accessor: 'category' },
    { header: 'Condition', accessor: 'productCondition' },
    { header: 'Price', accessor: 'price' },
    {
      header: 'Stock',
      accessor: 'stock',
      render: (stock, row) => (
        <span className={stock <= (row.originalData.lowStockThreshold || 0) ? 'text-red-600 font-medium' : 'text-neutral-700'}>
          {stock} units
        </span>
      ),
    },
    {
      header: 'Published',
      accessor: 'status',
      render: (status) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-700'
        }`}>
          {status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Products</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage inventory, product metadata, and brand availability without changing the current admin flow.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-[var(--shadow-soft-ui)] space-y-4">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-neutral-500" />
            <input
              className="w-full border rounded-xl p-2.5 text-sm"
              placeholder="Search by name, brand, or SKU"
              value={filters.q}
              onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-3">
            <select className="w-full border rounded-xl p-2.5 text-sm" value={filters.brand} onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}>
              <option value="">All Brands</option>
              {brands.map((brand) => <option key={brand._id} value={brand._id}>{brand.name}</option>)}
            </select>
            <select className="w-full border rounded-xl p-2.5 text-sm" value={filters.category} onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}>
              <option value="">All Categories</option>
              {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
            </select>
            <select className="w-full border rounded-xl p-2.5 text-sm" value={filters.productCondition} onChange={(e) => setFilters((prev) => ({ ...prev, productCondition: e.target.value }))}>
              <option value="">All Conditions</option>
              {PRODUCT_CONDITIONS.map((condition) => <option key={condition} value={condition}>{condition}</option>)}
            </select>
            <select className="w-full border rounded-xl p-2.5 text-sm" value={filters.stockStatus} onChange={(e) => setFilters((prev) => ({ ...prev, stockStatus: e.target.value }))}>
              {STOCK_FILTERS.map((item) => <option key={item.value || 'all'} value={item.value}>{item.label}</option>)}
            </select>
            <select className="w-full border rounded-xl p-2.5 text-sm" value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}>
              {STATUS_FILTERS.map((item) => <option key={item.value || 'all'} value={item.value}>{item.label}</option>)}
            </select>
            <input className="w-full border rounded-xl p-2.5 text-sm" type="number" placeholder="Min Price" value={filters.minPrice} onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))} />
            <input className="w-full border rounded-xl p-2.5 text-sm" type="number" placeholder="Max Price" value={filters.maxPrice} onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))} />
            <button
              type="button"
              onClick={() => setFilters({ q: '', brand: '', category: '', productCondition: '', stockStatus: '', status: '', minPrice: '', maxPrice: '' })}
              className="px-4 py-2.5 border border-neutral-200 rounded-xl text-sm font-medium hover:bg-neutral-50"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-[var(--shadow-soft-ui)] space-y-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Brand Management</h2>
            <p className="text-sm text-neutral-500 mt-1">Add, edit, delete, or enable and disable brands used in the product form.</p>
          </div>

          <form onSubmit={handleSaveBrand} className="grid grid-cols-1 gap-3">
            <input required className="w-full border rounded-xl p-2.5 text-sm" placeholder="Brand Name" value={brandForm.name} onChange={(e) => setBrandForm((prev) => ({ ...prev, name: e.target.value }))} />
            <textarea className="w-full border rounded-xl p-2.5 text-sm" rows="2" placeholder="Description (optional)" value={brandForm.description} onChange={(e) => setBrandForm((prev) => ({ ...prev, description: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" className="w-full border rounded-xl p-2.5 text-sm" placeholder="Sort Order" value={brandForm.sortOrder} onChange={(e) => setBrandForm((prev) => ({ ...prev, sortOrder: e.target.value }))} />
              <label className="flex items-center gap-2 border rounded-xl px-3 text-sm text-neutral-700">
                <input type="checkbox" checked={brandForm.isActive} onChange={(e) => setBrandForm((prev) => ({ ...prev, isActive: e.target.checked }))} />
                Enabled
              </label>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={brandSaving} className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-xl">
                {brandSaving ? 'Saving...' : editingBrandId ? 'Update Brand' : 'Add Brand'}
              </button>
              {editingBrandId && (
                <button type="button" onClick={resetBrandEditor} className="px-4 py-2 border border-neutral-200 text-sm font-medium rounded-xl hover:bg-neutral-50">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {brands.map((brand) => (
              <div key={brand._id} className="flex items-center justify-between gap-3 border border-neutral-100 rounded-xl p-3">
                <div>
                  <div className="font-medium text-neutral-900">{brand.name}</div>
                  <div className="text-xs text-neutral-500">{brand.isActive ? 'Enabled' : 'Disabled'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => handleToggleBrand(brand)} className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50" title="Enable or Disable">
                    <Power size={14} className={brand.isActive ? 'text-green-600' : 'text-neutral-500'} />
                  </button>
                  <button type="button" onClick={() => handleEditBrand(brand)} className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50" title="Edit Brand">
                    <Pencil size={14} />
                  </button>
                  <button type="button" onClick={() => handleDeleteBrand(brand)} className="p-2 rounded-lg border border-neutral-200 hover:bg-red-50 hover:text-red-600" title="Delete Brand">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {fetching ? (
        <div className="py-10 text-center text-sm font-bold text-gray-400">Loading products...</div>
      ) : (
        <DataTable columns={columns} data={tableData} onEdit={(row) => handleOpenModal(row.originalData)} onDelete={handleDelete} />
      )}

      {pagination && (
        <div className="text-sm text-neutral-500">
          Showing {tableData.length} products across {pagination.totalCount || tableData.length} total records.
        </div>
      )}


    </div>
  );
};

export default AdminProducts;

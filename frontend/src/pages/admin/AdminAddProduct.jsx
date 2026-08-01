import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, Eye } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { productsService, uploadService } from '../../api/services';
import { parseApiError } from '../../utils/errorHandler';

// Components
import BasicInfoSection from './components/product/BasicInfoSection';
import BrandCategorySection from './components/product/BrandCategorySection';
import PricingSection from './components/product/PricingSection';
import InventorySection from './components/product/InventorySection';
import ImageManager from '../../components/admin/ImageManager';
import ProductSidebar from './components/product/ProductSidebar';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  
  const isEditing = !!id;
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Main Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    productCondition: 'New',
    price: '',
    stock: '',
    availabilityStatus: 'Active',
    images: [],
    status: 'Draft',
    visibility: [],
  });

  // Track original images to handle deletion after save
  const [originalImages, setOriginalImages] = useState([]);

  // Load existing product if editing
  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    } else {
      // Try to load auto-save draft
      const draft = localStorage.getItem('admin_product_draft');
      if (draft) {
        try {
          setFormData(JSON.parse(draft));
          setHasUnsavedChanges(true);
        } catch (e) {
          console.error("Draft load error", e);
        }
      }
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await productsService.getById(id);
      if (res.data.success) {
        setFormData({
          ...res.data.data,
          availabilityStatus: res.data.data.isActive === false ? 'Out of Stock' : 'Active'
        });
        setOriginalImages(res.data.data.images || []);
      }
    } catch (err) {
      showToast('Failed to load product details', 'error');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  // Auto-save logic
  useEffect(() => {
    if (!isEditing && hasUnsavedChanges) {
      const timer = setTimeout(() => {
        localStorage.setItem('admin_product_draft', JSON.stringify(formData));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [formData, isEditing, hasUnsavedChanges]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData]);

  // Unsaved changes protection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async (forceStatus = null) => {
    try {
      setSaving(true);
      const payload = { 
        ...formData,
        price: Number(formData.price) || 0,
        stock: Number(formData.stock) || 0,
        isActive: formData.availabilityStatus === 'Active',
      };
      if (forceStatus) {
        payload.status = forceStatus;
      }
      // Basic Validation
      if (!payload.name) {
        showToast('Product name is required', 'error');
        setSaving(false);
        return;
      }
      if (!payload.brand) {
        showToast('Please select a brand', 'error');
        setSaving(false);
        return;
      }
      if (!payload.category) {
        showToast('Please select a category', 'error');
        setSaving(false);
        return;
      }
      if (payload.price <= 0) {
        showToast('Price must be greater than 0', 'error');
        setSaving(false);
        return;
      }
      if (payload.stock < 0) {
        showToast('Stock cannot be negative', 'error');
        setSaving(false);
        return;
      }

      if (!payload.description || payload.description.trim().length < 20) {
        showToast('Description must be at least 20 characters long', 'error');
        setSaving(false);
        return;
      }
      if (!payload.images || payload.images.length === 0) {
        showToast('Please upload at least one product image', 'error');
        setSaving(false);
        return;
      }

      let res;
      if (isEditing) {
        res = await productsService.update(id, payload);
      } else {
        res = await productsService.create(payload);
      }

      if (res.data.success) {
        // Handle image cleanup for removed images
        if (isEditing) {
          const currentPublicIds = formData.images.map(img => img.publicId).filter(Boolean);
          const removedImages = originalImages.filter(img => img.publicId && !currentPublicIds.includes(img.publicId));
          
          // Fire and forget deletions
          removedImages.forEach(img => {
            uploadService.deleteImage(img.publicId).catch(console.error);
          });
        }

        showToast(`Product ${isEditing ? 'updated' : 'created'} successfully!`, 'success');
        setHasUnsavedChanges(false);
        localStorage.removeItem('admin_product_draft');
        
        if (!isEditing) {
          navigate(`/admin/products/${res.data.data._id}/edit`, { replace: true });
        } else {
          setOriginalImages(formData.images);
        }
      }
    } catch (error) {
      showToast(parseApiError(error), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 pb-20 font-sans text-gray-900">
      {/* Sticky Save Bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white/90 px-6 py-4 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/products')}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-semibold">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
            {hasUnsavedChanges && <span className="text-sm text-amber-600">Unsaved changes</span>}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleSave('Draft')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors disabled:opacity-50"
            disabled={saving}
          >
            Save as Draft
          </button>
          <button 
            onClick={() => handleSave()}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-50"
            disabled={saving}
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEditing ? 'Update Product' : 'Publish Product'}
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Left Column (Main Form) */}
          <div className="lg:col-span-2 space-y-8">
            <BasicInfoSection data={formData} updateField={updateField} />
            <BrandCategorySection data={formData} updateField={updateField} />
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Media</h2>
              <ImageManager images={formData.images} setFormData={setFormData} maxImages={5} />
            </div>
            <PricingSection data={formData} updateField={updateField} />
            <InventorySection data={formData} updateField={updateField} />
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-8">
            <ProductSidebar data={formData} updateField={updateField} />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;

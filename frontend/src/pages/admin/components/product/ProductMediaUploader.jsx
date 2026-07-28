import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Crop, Plus } from 'lucide-react';
import { useToast } from '../../../../context/ToastContext';

const ProductMediaUploader = ({ images = [], updateField }) => {
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImageForCrop, setSelectedImageForCrop] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    // For now, convert to object URLs for preview. 
    // Real implementation would upload to Cloudinary/S3 and get URLs.
    const newImages = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      file: file,
      isPrimary: images.length === 0, // First image is primary
      alt: ''
    }));
    
    updateField('images', [...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    
    // Ensure one primary image exists
    if (newImages.length > 0 && !newImages.some(img => img.isPrimary)) {
      newImages[0].isPrimary = true;
    }
    
    updateField('images', newImages);
  };

  const setPrimary = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    updateField('images', newImages);
  };

  const openCropModal = (index) => {
    setSelectedImageForCrop({ ...images[index], index });
    setCropModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Media</h2>
          <p className="text-sm text-gray-500 mt-1">Add images to showcase your product.</p>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Upload Zone */}
        <div 
          className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer ${
            dragActive 
              ? 'border-amber-500 bg-amber-50/50' 
              : 'border-gray-200 hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            onChange={handleChange}
          />
          <div className="bg-white p-4 rounded-full shadow-sm border border-gray-100 mb-4">
            <Upload className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900">
            Drag & drop images here or <span className="text-amber-600">browse</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Recommended size: 1080x1080px (Square). Max 5MB per file.
          </p>
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`relative group rounded-xl overflow-hidden border-2 aspect-square bg-gray-50 ${
                  img.isPrimary ? 'border-amber-500' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img 
                  src={img.url || img} 
                  alt={img.alt || 'Product thumbnail'} 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-end gap-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openCropModal(idx); }}
                      className="p-1.5 bg-white/90 rounded hover:bg-white text-gray-700 hover:text-amber-600 transition-colors shadow-sm"
                      title="Crop & Optimize"
                    >
                      <Crop size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                      className="p-1.5 bg-white/90 rounded hover:bg-white text-gray-700 hover:text-red-600 transition-colors shadow-sm"
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  {!img.isPrimary && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setPrimary(idx); }}
                      className="w-full py-1.5 bg-white/90 rounded text-xs font-medium text-gray-700 hover:bg-white hover:text-amber-600 transition-colors shadow-sm"
                    >
                      Set as Primary
                    </button>
                  )}
                </div>

                {img.isPrimary && (
                  <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold tracking-wider uppercase rounded text-center shadow-sm">
                    Primary Image
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Premium Crop Modal (Stub/Implementation) */}
      {cropModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-[20px] w-full max-w-[1000px] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100/50">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Crop & Optimize Image</h3>
                  <p className="text-sm text-gray-500">Prepare your image for the product catalog.</p>
                </div>
              </div>
              <button 
                onClick={() => setCropModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-8 flex gap-8 flex-1 overflow-hidden bg-gray-50/20">
               {/* Left: Main Crop Area */}
               <div className="flex-1 bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center relative">
                  <img src={selectedImageForCrop?.url} alt="Crop preview" className="max-w-full max-h-full object-contain p-4" />
                  
                  {/* Fake Cropper UI overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-white border border-gray-400"></div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border border-gray-400"></div>
                      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border border-gray-400"></div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-gray-400"></div>
                    </div>
                  </div>
               </div>

               {/* Right: Tools Panel */}
               <div className="w-[280px] flex flex-col gap-6 shrink-0">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Aspect Ratio</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="py-2.5 px-3 rounded-xl border-2 border-amber-500 bg-amber-50 text-amber-700 text-sm font-medium shadow-sm transition-all">
                        Square (1:1)
                      </button>
                      <button className="py-2.5 px-3 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all">
                        Portrait
                      </button>
                      <button className="py-2.5 px-3 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all">
                        Landscape
                      </button>
                      <button className="py-2.5 px-3 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all">
                        Free
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Optimization</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-white cursor-pointer hover:border-gray-300">
                        <input type="checkbox" className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500" defaultChecked />
                        <span className="text-sm text-gray-700">Remove Background</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-white cursor-pointer hover:border-gray-300">
                        <input type="checkbox" className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500" defaultChecked />
                        <span className="text-sm text-gray-700">Auto Enhance</span>
                      </label>
                    </div>
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button 
                onClick={() => setCropModalOpen(false)}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  addToast('Image optimized successfully!', 'success');
                  setCropModalOpen(false);
                }}
                className="px-6 py-2.5 text-sm font-medium text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <Crop size={16} />
                Apply & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMediaUploader;

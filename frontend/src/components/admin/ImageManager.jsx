import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { UploadCloud, Trash2, X, RotateCw, ZoomIn, ZoomOut, ArrowLeft, ArrowRight, Star, Image as ImageIcon, CheckCircle } from 'lucide-react';
import getCroppedImg from '../../utils/cropImage';
import { uploadService } from '../../api/services';

const ImageManager = ({ images, setFormData, maxImages = 5 }) => {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Cropper State
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // New Cropper States for Premium Modal
  const [aspect, setAspect] = useState(1);
  const [quality, setQuality] = useState(90);
  const [format, setFormat] = useState('image/jpeg');
  const [originalImageMeta, setOriginalImageMeta] = useState({ width: 0, height: 0, size: 0 });

  // Handle ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && imageSrc && !loading) {
        handleCloseCropper();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageSrc, loading]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (imageSrc) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [imageSrc]);

  const onImageLoaded = useCallback((image) => {
    // Need to calculate approximate original size since we only have data URL
    // Data URL size is roughly base64 length * 0.75
    const sizeInBytes = imageSrc ? imageSrc.length * 0.75 : 0;
    setOriginalImageMeta({
      width: image.naturalWidth,
      height: image.naturalHeight,
      size: sizeInBytes
    });
  }, [imageSrc]);

  const onDrop = useCallback((acceptedFiles) => {
    if (images.length >= maxImages) {
      alert(`You can only upload up to ${maxImages} images.`);
      return;
    }
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  }, [images, maxImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        alert('File is too large. Maximum size is 5MB.');
      } else if (error?.code === 'file-invalid-type') {
        alert('Invalid file type. Only JPEG, PNG, and WebP are supported.');
      } else {
        alert(error?.message || 'Failed to upload image.');
      }
    },
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 5 * 1024 * 1024,
    multiple: false
  });

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleUploadCroppedImage = async () => {
    try {
      setLoading(true);
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation, format, quality / 100);
      
      const extension = format === 'image/webp' ? 'webp' : format === 'image/png' ? 'png' : 'jpg';
      const file = new File([croppedBlob], `image-${Date.now()}.${extension}`, { type: format });
      const fd = new FormData();
      fd.append('image', file);
      
      const res = await uploadService.uploadImage(fd, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });

      if (res.data?.data) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, { url: res.data.data.url, publicId: res.data.data.publicId }]
        }));
      }
      
      // Close without prompt since we successfully uploaded
      setImageSrc(null);
      setZoom(1);
      setRotation(0);
      setAspect(1);
      setQuality(90);
      setFormat('image/jpeg');
    } catch (err) {
      console.error('Image upload failed', err);
      alert('Upload failed. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleCloseCropper = () => {
    if (imageSrc && !loading) {
      if (!window.confirm('Discard image edits?')) return;
    }
    setImageSrc(null);
    setZoom(1);
    setRotation(0);
    setAspect(1);
    setQuality(90);
    setFormat('image/jpeg');
  };

  const handleRemoveImage = (publicId) => {
    // Only remove from local state. Cloudinary deletion happens upon product save in AdminAddProduct.jsx
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.publicId !== publicId)
    }));
  };

  const moveImage = (index, direction) => {
    if (index + direction < 0 || index + direction >= images.length) return;
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[index + direction];
    newImages[index + direction] = temp;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const setPrimary = (index) => {
    if (index === 0) return;
    const newImages = [...images];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getEstimatedSize = () => {
    if (!croppedAreaPixels) return 0;
    const area = croppedAreaPixels.width * croppedAreaPixels.height;
    // Rough estimation based on format and quality
    let bytesPerPixel = 0.5; // jpg 90%
    if (format === 'image/png') bytesPerPixel = 1.2;
    if (format === 'image/webp') bytesPerPixel = 0.3;
    
    return area * bytesPerPixel * (quality / 100);
  };

  return (
    <div className="space-y-4">
      <label className="block text-xs font-medium text-neutral-700">
        Product Images ({images.length}/{maxImages})
      </label>
      
      <div className="flex flex-wrap gap-4 mb-3">
        {images.map((img, idx) => (
          <div key={img.publicId || idx} className="relative w-32 h-32 rounded-xl border border-neutral-200 overflow-hidden bg-neutral-50 group shadow-sm">
            <img src={img.url} alt={`product-${idx}`} className="w-full h-full object-cover" />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
              <div className="flex justify-between w-full">
                <button 
                  type="button" 
                  onClick={() => setPrimary(idx)}
                  className={`p-1 rounded text-white ${idx === 0 ? 'text-yellow-400' : 'hover:text-yellow-400'}`}
                  title="Set as Primary"
                >
                  <Star size={16} fill={idx === 0 ? "currentColor" : "none"} />
                </button>
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage(img.publicId)}
                  className="p-1 rounded text-white hover:text-red-400"
                  title="Remove Image"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex justify-between w-full">
                <button 
                  type="button" 
                  onClick={() => moveImage(idx, -1)}
                  disabled={idx === 0}
                  className="p-1 rounded text-white disabled:opacity-30 hover:bg-white/20"
                >
                  <ArrowLeft size={16} />
                </button>
                <button 
                  type="button" 
                  onClick={() => moveImage(idx, 1)}
                  disabled={idx === images.length - 1}
                  className="p-1 rounded text-white disabled:opacity-30 hover:bg-white/20"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
            {idx === 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-yellow-400/90 text-yellow-900 text-[10px] font-bold text-center py-0.5">
                PRIMARY
              </div>
            )}
          </div>
        ))}

        {images.length < maxImages && (
          <div 
            {...getRootProps()} 
            className={`w-32 h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors
              ${isDragActive ? 'border-neutral-900 bg-neutral-100 text-neutral-900' : 'border-neutral-300 bg-neutral-50 text-neutral-400 hover:border-neutral-400 hover:text-neutral-600'}
            `}
          >
            <input {...getInputProps()} />
            <UploadCloud size={24} className="mb-2" />
            <span className="text-xs font-medium px-2 text-center">
              {isDragActive ? "Drop here" : "Drag & Drop or Click"}
            </span>
          </div>
        )}
      </div>

      {/* Premium Cropper Modal */}
      {imageSrc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-150">
          <div 
            className="bg-white rounded-2xl flex flex-col shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
            style={{ 
              width: '96vw', 
              maxWidth: 'min(96vw, 1700px)', 
              height: '94vh', 
              maxHeight: '94vh' 
            }}
          >
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                  <ImageIcon size={20} className="text-neutral-700" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900 leading-tight">Crop & Optimize Image</h2>
                  <p className="text-xs text-neutral-500">Prepare your image before uploading.</p>
                </div>
              </div>
              <button 
                onClick={handleCloseCropper} 
                disabled={loading}
                className="p-2 hover:bg-neutral-50 text-neutral-400 hover:text-neutral-700 rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-y-auto lg:overflow-hidden bg-neutral-50/50">
              
              {/* LEFT COLUMN: Editing Area (70%) */}
              <div className="flex-[7] flex flex-col min-h-[500px] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-neutral-100 p-6">
                
                {/* Cropper Container */}
                <div 
                  className="relative flex-1 bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-inner border border-neutral-200/20"
                  onDoubleClick={() => { setZoom(1); setCrop({x:0, y:0}); }}
                >
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    onMediaLoaded={onImageLoaded}
                    showGrid={true}
                    style={{
                      containerStyle: { backgroundColor: '#1A1A1A' }
                    }}
                  />
                </div>
                
                {/* Bottom Controls */}
                <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Aspect Ratios */}
                  <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-neutral-200 shadow-sm overflow-x-auto max-w-full">
                    {[
                      { label: 'Free', value: undefined },
                      { label: '1:1', value: 1 },
                      { label: '4:5', value: 4/5 },
                      { label: '3:4', value: 3/4 },
                      { label: '16:9', value: 16/9 },
                      { label: '9:16', value: 9/16 },
                    ].map(ar => (
                      <button
                        key={ar.label}
                        onClick={() => setAspect(ar.value)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                          aspect === ar.value 
                            ? 'bg-neutral-900 text-white shadow-sm' 
                            : 'text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        {ar.label}
                      </button>
                    ))}
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-neutral-200 shadow-sm w-full sm:w-auto">
                    <button onClick={() => setZoom(Math.max(1, zoom - 0.2))} className="text-neutral-400 hover:text-neutral-700">
                      <ZoomOut size={16} />
                    </button>
                    <input 
                      type="range" 
                      value={zoom} 
                      min={1} max={3} step={0.1} 
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-24 accent-neutral-900" 
                    />
                    <button onClick={() => setZoom(Math.min(3, zoom + 0.2))} className="text-neutral-400 hover:text-neutral-700">
                      <ZoomIn size={16} />
                    </button>
                    <div className="h-4 w-[1px] bg-neutral-200 mx-1"></div>
                    <button onClick={() => setZoom(1)} className="text-xs font-medium text-neutral-600 hover:text-neutral-900">
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Info & Optimization (30%) */}
              <div className="flex-[3] flex flex-col p-6 overflow-y-auto space-y-4">
                
                {/* Card 2: Image Information */}
                <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <ImageIcon size={16} className="text-[#C89B3C]" />
                    Image Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Original Size</span>
                      <span className="font-medium text-neutral-900">{originalImageMeta.width} × {originalImageMeta.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Output Resolution</span>
                      <span className="font-medium text-neutral-900">
                        {croppedAreaPixels ? `${Math.round(croppedAreaPixels.width)} × ${Math.round(croppedAreaPixels.height)}` : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Original File</span>
                      <span className="font-medium text-neutral-900">{formatBytes(originalImageMeta.size)}</span>
                    </div>
                  </div>
                </div>

                {/* Card 3: Optimization */}
                <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-neutral-900">Optimization</h3>
                    <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase border border-green-200/50">
                      <CheckCircle size={10} />
                      Optimized
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    {/* Format Toggle */}
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-2">Output Format</label>
                      <div className="flex p-1 bg-neutral-100 rounded-lg">
                        {['image/jpeg', 'image/png', 'image/webp'].map(fmt => (
                          <button
                            key={fmt}
                            onClick={() => setFormat(fmt)}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                              format === fmt 
                                ? 'bg-white text-neutral-900 shadow-sm' 
                                : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                          >
                            {fmt.split('/')[1].toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quality Slider (only for lossy formats) */}
                    {format !== 'image/png' && (
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <label className="block text-xs font-medium text-neutral-500">Quality</label>
                          <span className="text-xs font-bold text-neutral-900">{quality}%</span>
                        </div>
                        <input 
                          type="range" 
                          value={quality} 
                          min={10} max={100} step={5} 
                          onChange={(e) => setQuality(Number(e.target.value))}
                          className="w-full accent-[#C89B3C]" 
                        />
                        <div className="flex justify-between mt-1 text-[10px] text-neutral-400">
                          <span>Smaller file</span>
                          <span>Higher quality</span>
                        </div>
                      </div>
                    )}

                    {/* Estimated Size */}
                    <div className="pt-4 border-t border-neutral-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">Est. Final Size</span>
                        <span className="text-base font-bold text-[#C89B3C]">{formatBytes(getEstimatedSize())}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Action Bar */}
            <div className="p-4 px-6 border-t border-neutral-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 sticky bottom-0 z-20">
              <span className="text-xs text-neutral-400 font-medium hidden sm:block">
                Drag to reposition • Scroll to zoom • Double click to fit
              </span>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  type="button" 
                  onClick={handleCloseCropper} 
                  disabled={loading}
                  className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 bg-white border border-neutral-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleUploadCroppedImage} 
                  disabled={loading}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-neutral-900 hover:bg-black text-white text-sm font-semibold rounded-xl relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-neutral-900/20 disabled:hover:translate-y-0 disabled:opacity-80 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#C89B3C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Uploading {uploadProgress}%</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={16} className="text-[#C89B3C]" />
                      Confirm & Upload
                    </>
                  )}
                  {loading && (
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-[#C89B3C]/20 z-0 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  )}
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageManager;

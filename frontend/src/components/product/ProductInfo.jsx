import React from 'react';
import { Star, ShieldCheck, Share2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ProductInfo = ({ product }) => {
  const { showToast } = useToast();
  const conditionLabel = product.productCondition || product.conditionType || product.condition || 'New';
  const priceLabel = typeof product.price === 'number' ? `₹ ${product.price.toLocaleString('en-IN')}` : product.price;
  const originalPriceLabel = typeof product.originalPrice === 'number' ? `₹ ${product.originalPrice.toLocaleString('en-IN')}` : product.originalPrice;
  const discountLabel = typeof product.discount === 'number' ? `${product.discount}% OFF` : product.discount;

  const handleShare = async () => {
    const productUrl = `${window.location.origin}/product/${product._id || product.id}`;
    const shareData = {
      title: product.name,
      text: `${product.name} - MobiMart`,
      url: productUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled share — do not show an error
        if (err.name !== 'AbortError') {
          showToast('Could not share product', 'error');
        }
      }
    } else {
      // Clipboard fallback for desktop / unsupported browsers
      try {
        await navigator.clipboard.writeText(productUrl);
        showToast('Product link copied!', 'success');
      } catch {
        showToast('Could not copy link', 'error');
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-start text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui">
      {/* Top row: condition badge + share button */}
      <div className="w-full flex items-center justify-between mb-3">
        <span className="inline-block px-3 py-1 text-[9px] sm:text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-250/30 rounded-full uppercase tracking-wide">
          {conditionLabel}
        </span>
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share product"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors shrink-0"
        >
          <Share2 size={15} className="text-gray-500" strokeWidth={2.2} />
        </button>
      </div>

      <h1 className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight mb-2 tracking-tight">{product.name}</h1>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-neutral-800 bg-[#ECEFF2]/40 px-2 py-0.5 rounded">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" strokeWidth={0} />
          <span>{product.averageRating || product.rating || '4.8'}</span>
        </div>

        <span className="text-[10.5px] sm:text-xs font-bold text-gray-400">({product.reviewCount || '421'} Reviews)</span>
        <span className="text-gray-300 select-none">|</span>

        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-green-600 font-extrabold">
          <ShieldCheck className="w-3.5 h-3.5 text-green-505" strokeWidth={2.4} />
          <span>Verified Buyers</span>
        </div>
      </div>

      <div className="flex items-baseline gap-2.5">
        <span className="text-xl sm:text-2xl font-black text-neutral-950">{priceLabel}</span>
        {product.originalPrice && <span className="text-xs sm:text-sm text-gray-400 font-semibold line-through">{originalPriceLabel}</span>}
        {product.discount ? <span className="px-2 py-0.5 text-[9.5px] sm:text-[10.5px] font-extrabold text-amber-600 bg-amber-50 rounded">{discountLabel}</span> : null}
      </div>

      <p className="text-[9.5px] sm:text-[10.5px] text-gray-400 font-bold mt-1 tracking-tight">Inclusive of all taxes</p>
    </div>
  );
};

export default ProductInfo;


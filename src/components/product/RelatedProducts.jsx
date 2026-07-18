import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { getRelatedProducts } from '../../data/products';
import { useWishlist } from '../../context/WishlistContext';

/* ==========================================================================
   RelatedProducts Component (Slice 5)
   - Fetches and displays related devices matching brand / category
   - Renders interactive heart check wishlist triggers
   - Triggers React Router navigations to selected product IDs
   ========================================================================== */

export const RelatedProducts = ({ currentId, brand }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();
  
  // Fetch up to 4 related devices
  const related = getRelatedProducts(currentId, brand);

  if (!related || related.length === 0) return null;

  return (
    <div className="w-full text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui flex flex-col gap-5">
      <h3 className="text-sm sm:text-base font-extrabold text-neutral-950 uppercase tracking-wider border-b border-gray-100 pb-3">
        You May Also Like
      </h3>

      {/* Grid listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map((prod) => {
          const liked = isWishlisted(prod.id);
          
          return (
            <div 
              key={prod.id}
              onClick={() => {
                navigate(`/product/${prod.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="border border-gray-150/50 rounded-2xl p-4 bg-[#FAF9F6]/20 flex flex-col items-center justify-between text-center relative group cursor-pointer hover:border-neutral-450 hover:shadow-glass hover:bg-white transition-all duration-300"
            >
              
              {/* Top Right Wishlist action */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(prod);
                }}
                className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white border border-gray-100 hover:text-red-500 hover:shadow shadow-sm transition-all cursor-pointer z-10 text-neutral-700"
                aria-label={`Toggle wishlist for ${prod.name}`}
              >
                <Heart 
                  size={14} 
                  className={liked ? 'fill-red-500 text-red-500' : 'text-gray-400'} 
                  strokeWidth={2.4} 
                />
              </button>

              {/* Product Mockup Container */}
              <div className="h-28 sm:h-32 w-auto flex items-center justify-center p-2 mt-2 transition-opacity duration-300 opacity-95 group-hover:opacity-100">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="h-full w-auto object-contain object-bottom filter drop-shadow-sm"
                />
              </div>

              {/* Product Meta description */}
              <div className="w-full text-center mt-3.5 flex flex-col items-center">
                <h4 className="text-[11.5px] font-black text-neutral-950 truncate max-w-[140px] leading-tight">
                  {prod.name}
                </h4>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 mb-1.5 truncate max-w-[140px]">
                  {prod.specifications?.[4]?.value || '128GB'} • {prod.colorOptions?.[0]?.name || 'Titanium'}
                </p>
                <span className="text-xs font-black text-neutral-950 leading-none">
                  {prod.price}
                </span>

                {/* Certified Badge tag */}
                <span className="inline-block mt-2.5 px-2 py-0.5 border border-amber-250/20 bg-amber-50/50 text-[8px] sm:text-[9px] font-bold text-amber-600 rounded-md">
                  ★ Certified
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;

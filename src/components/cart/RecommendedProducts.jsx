import React from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../../data/products';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

/* ==========================================================================
   RecommendedProducts Component
   - Suggests premium devices to add to the cart
   - Excludes any items already added to the user's cart
   - Scrollable row linking each suggestion card to its PDP
   ========================================================================== */

export const RecommendedProducts = ({ cartItems = [] }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();

  // Extract array of product IDs already in cart
  const cartIds = cartItems.map((item) => item.product.id);

  // Filter products excluding the ones in cart, showing up to 4 recommendations
  const suggestions = products
    .filter((prod) => !cartIds.includes(prod.id))
    .slice(0, 4);

  if (suggestions.length === 0) return null;

  return (
    <div className="w-full text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui flex flex-col gap-4">
      <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider pb-2 border-b border-gray-100">
        You May Also Like
      </h3>

      {/* Horizontal Swipe Scroll list */}
      <div className="w-full overflow-x-auto no-scrollbar py-1">
        <div className="flex items-stretch gap-4">
          {suggestions.map((prod) => {
            const liked = isWishlisted(prod.id);

            return (
              <div
                key={prod.id}
                onClick={() => {
                  navigate(`/product/${prod.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-40 sm:w-44 border border-gray-150/50 rounded-2xl p-3.5 bg-[#FAF9F6]/25 flex flex-col items-center justify-between text-center shrink-0 relative group cursor-pointer hover:border-neutral-450 hover:shadow-glass hover:bg-white transition-all duration-300"
              >
                {/* Wishlist toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(prod);
                  }}
                  className="absolute top-2.5 right-2.5 p-1 rounded-full bg-white border border-gray-100 hover:text-red-500 hover:shadow-sm shadow-[0_2px_6px_rgba(0,0,0,0.015)] transition-all cursor-pointer z-10 text-neutral-700"
                  aria-label={`Toggle wishlist for ${prod.name}`}
                >
                  <Heart
                    size={11.5}
                    className={liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                    strokeWidth={2.4}
                  />
                </button>

                {/* Thumbnail */}
                <div className="h-20 w-auto flex items-center justify-center p-1.5 mt-1 transition-opacity duration-300 opacity-95 group-hover:opacity-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="h-full w-auto object-contain object-bottom filter drop-shadow-sm"
                  />
                </div>

                {/* Metadata */}
                <div className="w-full text-center mt-3 flex flex-col items-center">
                  <h4 className="text-[10.5px] sm:text-[11px] font-black text-neutral-950 truncate max-w-[120px] leading-tight">
                    {prod.name}
                  </h4>
                  <p className="text-[8.5px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 mb-1 truncate max-w-[120px]">
                    {prod.brand}
                  </p>
                  <span className="text-[11px] font-black text-neutral-950 leading-none">
                    {prod.price}
                  </span>

                  {/* Certified badge tag */}
                  <span className="inline-block mt-2 px-1.5 py-0.5 border border-amber-250/15 bg-amber-50/40 text-[7.5px] sm:text-[8px] font-bold text-amber-600 rounded">
                    ★ Certified
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecommendedProducts;

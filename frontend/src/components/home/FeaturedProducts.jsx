import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import Container from '../ui/Container';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { productsService } from '../../api/services';

/* ==========================================================================
   FeaturedProducts Component
   - Fetches real data from the backend products API
   - Top Featured Card: products[0] — horizontal hero layout
   - Bottom Grid: products[1], [2], [3] — compact 3-column cards
   - All cards link to /product/:id PDP routes
   ========================================================================== */

export const FeaturedProducts = () => {
  const [backendProducts, setBackendProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productsService.getAll({ sort: 'popularity', limit: 4 });
        setBackendProducts(res.data.data.products || res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch featured products', err);
      }
    };
    fetchProducts();
  }, []);

  // Use fetched data
  const featuredHero = backendProducts[0]; 
  const gridProducts = backendProducts.slice(1, 4); 

  if (!featuredHero) return null;

  // Format price if it's a number
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(price);
    }
    return price;
  };

  const heroImage = featuredHero.images?.[0]?.url || featuredHero.image;

  return (
    <section className="w-full pb-8 bg-white">
      <Container>
        <SectionTitle title="Featured Products" />

        <div className="flex flex-col gap-4 sm:gap-6">

          {/* ── TOP HERO FEATURED CARD ─────────────────────────────────────── */}
          <Link to={`/product/${featuredHero._id || featuredHero.id}`} className="block group">
            <Card
              variant="custom"
              className="bg-[#ECEFF3] border border-gray-250/10 p-5 sm:p-8 flex flex-row items-center justify-between gap-4 h-[180px] sm:h-[260px] relative overflow-hidden hover:shadow-soft-ui transition-all duration-300 cursor-pointer"
            >
              {/* Left — Real product image */}
              <div className="w-[45%] h-full flex items-end justify-start relative">
                <div className="w-[110px] sm:w-[220px] h-[95%] flex items-end justify-center">
                  <img
                    src={heroImage}
                    alt={featuredHero.name}
                    className="h-full w-auto object-contain object-bottom drop-shadow-xl transition-opacity duration-300 opacity-95 group-hover:opacity-100"
                  />
                </div>
              </div>

              {/* Right — Real product details */}
              <div className="flex-1 flex flex-col items-start text-left z-10 pl-2 sm:pl-4 md:pl-6 justify-center">
                {/* Condition badge */}
                <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded mb-2 sm:mb-3 ${
                  featuredHero.conditionType === 'New'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {featuredHero.conditionType || featuredHero.condition || 'New'}
                </span>

                <h3 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-950 tracking-tight leading-tight mb-1 md:mb-2">
                  {featuredHero.name}
                </h3>

                {/* Rating row */}
                <div className="flex items-center gap-1 mb-2 sm:mb-4">
                  <Star size={10} className="fill-amber-400 text-amber-400" />
                  <span className="text-[9px] sm:text-xs font-bold text-neutral-700">
                    {featuredHero.rating} · {featuredHero.reviewsCount || featuredHero.reviewCount || 0} reviews
                  </span>
                </div>

                {/* Price row */}
                <div className="flex items-baseline gap-2 mb-3 md:mb-5">
                  <span className="text-sm sm:text-xl md:text-2xl font-black text-neutral-950">
                    {formatPrice(featuredHero.price)}
                  </span>
                  {featuredHero.originalPrice && (
                    <span className="text-[9px] sm:text-xs text-gray-400 line-through font-semibold">
                      {formatPrice(featuredHero.originalPrice)}
                    </span>
                  )}
                  {featuredHero.discount && (
                    <span className="text-[8px] sm:text-[10px] font-black text-amber-600">
                      {featuredHero.discount}% OFF
                    </span>
                  )}
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="cursor-pointer !px-4 !py-1.5 md:!px-6 md:!py-2.5 !text-[8px] sm:!text-xs flex items-center gap-1 hover:brightness-90 transition-all"
                >
                  Shop Now
                  <ArrowRight size={10} />
                </Button>
              </div>

              {/* Subtle background brand glow */}
              <div className="absolute right-0 top-0 bottom-0 w-[40%] bg-gradient-to-l from-gray-200/30 to-transparent pointer-events-none" />
            </Card>
          </Link>

          {/* ── BOTTOM 3-COLUMN GRID ──────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            {gridProducts.map((product) => {
              const pImage = product.images?.[0]?.url || product.image;
              const pBrand = product.brand?.name || product.brand;
              return (
              <Link
                key={product._id || product.id}
                to={`/product/${product._id || product.id}`}
                className="block group"
              >
                <Card
                  variant="custom"
                  className="bg-white border border-gray-150/80 rounded-xl p-2.5 sm:p-4 flex flex-col text-left hover:shadow-soft-ui transition-all duration-300 cursor-pointer h-full"
                >
                  {/* Product image — real asset */}
                  <div className="bg-[#FAF9F6] border border-gray-100 rounded-lg aspect-square w-full flex items-center justify-center overflow-hidden mb-2.5 sm:mb-4 p-2">
                    <img
                      src={pImage}
                      alt={product.name}
                      className="h-full w-auto object-contain transition-opacity duration-300 opacity-95 group-hover:opacity-100"
                    />
                  </div>

                  {/* Condition badge */}
                  <span className={`self-start text-[6.5px] sm:text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded mb-1 ${
                    product.conditionType === 'New'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-amber-50 text-amber-600 border border-amber-200/50'
                  }`}>
                    {product.conditionType === 'New' ? 'New' : 'Certified'}
                  </span>

                  {/* Product Name */}
                  <h4 className="text-[9px] sm:text-sm font-extrabold text-neutral-950 leading-tight truncate mt-0.5">
                    {product.name}
                  </h4>

                  {/* Brand */}
                  <span className="text-[7px] sm:text-[10px] text-gray-400 font-semibold tracking-wide mt-0.5">
                    {pBrand}
                  </span>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-[9px] sm:text-sm font-extrabold text-neutral-950 leading-none">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[7px] sm:text-[10px] text-gray-400 line-through font-semibold">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-0.5 mt-1.5">
                    <Star size={8} className="fill-amber-400 text-amber-400" />
                    <span className="text-[7px] sm:text-[9px] font-bold text-neutral-600">
                      {product.rating || 0}
                    </span>
                  </div>
                </Card>
              </Link>
            )})}
          </div>

        </div>
      </Container>
    </section>
  );
};

export default FeaturedProducts;

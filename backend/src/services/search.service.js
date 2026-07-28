import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import Brand from '../models/Brand.model.js';

export const fullTextSearch = async (query = {}) => {
  const { q, category, brand, minPrice, maxPrice, sort, page = 1, limit = 20 } = query;
  
  const filter = { isActive: true };
  
  // Text Search
  if (q) {
    filter.$text = { $search: q };
  }
  
  // Facet Filters
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  
  // Price Range
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  // Sorting
  let sortOption = {};
  if (q) {
    // If text searching, default sort by text match score
    sortOption = { score: { $meta: 'textScore' } };
  } else {
    sortOption = { createdAt: -1 }; // Default sort
  }

  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'rating') sortOption = { averageRating: -1 };
  if (sort === 'newest') sortOption = { createdAt: -1 };

  const skip = (page - 1) * limit;

  // Execute Search
  const queryObj = Product.find(filter)
    .select('name slug price originalPrice images averageRating reviewCount conditionType badge stock')
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  if (q) {
    queryObj.select({ score: { $meta: 'textScore' } });
  }

  const products = await queryObj.lean();
  const total = await Product.countDocuments(filter);

  return {
    products,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getSearchSuggestions = async (q) => {
  if (!q || q.length < 2) return [];

  // Simple regex prefix match for autocomplete
  const regex = new RegExp(`^${q}`, 'i');
  
  const suggestions = await Product.find({ name: regex, isActive: true })
    .select('name slug image')
    .limit(5)
    .lean();

  return suggestions.map(p => ({
    name: p.name,
    slug: p.slug,
    image: p.images && p.images.length > 0 ? p.images[0].url : null
  }));
};

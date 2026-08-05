import connectDB from './src/config/db.js';
import Product from './src/models/Product.model.js';
import { queryProducts } from './src/services/product.service.js';

const run = async () => {
  await connectDB();
  
  // What if frontend sends nothing?
  const res1 = await queryProducts({ limit: 12, page: 1, minPrice: 0, maxPrice: 150000, sort: 'popularity' });
  console.log('Query with no filters count:', res1.data.length);
  
  // What if frontend sends undefined?
  const res2 = await queryProducts({ limit: 12, page: 1, brand: undefined });
  console.log('Query with brand=undefined:', res2.data.length);

  // What if frontend sends 'all'?
  const res3 = await queryProducts({ limit: 12, page: 1, brand: 'all' });
  console.log('Query with brand="all":', res3.data.length);

  process.exit(0);
};

run();

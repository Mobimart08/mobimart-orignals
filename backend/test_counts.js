import connectDB from './src/config/db.js';
import Product from './src/models/Product.model.js';

const run = async () => {
  await connectDB();
  const count = await Product.countDocuments({ isActive: true });
  console.log("Total Active:", count);
  const filteredCount = await Product.countDocuments({ isActive: true, price: { $gte: 0, $lte: 150000 } });
  console.log("Filtered by Price Active:", filteredCount);
  process.exit(0);
};

run();

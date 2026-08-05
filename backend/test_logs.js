import connectDB from './src/config/db.js';
import { listProducts } from './src/controllers/product.controller.js';

const run = async () => {
  await connectDB();
  
  const req = {
    query: {
      page: 1,
      limit: 12
    }
  };
  
  const res = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(payload) {
      // Nothing needed here, just want to trigger the console.logs in controller
      return payload;
    }
  };
  
  await listProducts(req, res);
  
  process.exit(0);
};

run();

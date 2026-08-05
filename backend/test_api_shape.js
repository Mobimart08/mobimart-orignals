import connectDB from './src/config/db.js';
import { queryProducts } from './src/services/product.service.js';
import ApiResponse from './src/utils/ApiResponse.js';

const run = async () => {
  await connectDB();
  
  const result = await queryProducts({ limit: 2, page: 1 });
  
  // Simulate ApiResponse.paginated
  const mockRes = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(payload) {
      console.log('--- EXACT JSON PAYLOAD ---');
      console.log(JSON.stringify(payload, null, 2));
      return payload;
    }
  };
  
  ApiResponse.paginated(mockRes, 'Success', result.data, result.pagination);
  
  process.exit(0);
};

run();

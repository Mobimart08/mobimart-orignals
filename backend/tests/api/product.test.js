import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Product API Endpoints', () => {
  it('should fetch a list of products', async () => {
    const res = await request(app).get('/api/v1/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should fetch a single product by id (even if invalid formats return 400)', async () => {
    // Assuming 400 for invalid ObjectId format
    const res = await request(app).get('/api/v1/products/invalid-id');
    expect(res.status).toBe(404); 
  });
});

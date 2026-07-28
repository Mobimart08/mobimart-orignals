import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Cart API Endpoints', () => {
  it('should deny access to get cart without auth token', async () => {
    const res = await request(app).get('/api/v1/cart');
    expect(res.status).toBe(401);
  });

  it('should deny access to add to cart without auth token', async () => {
    const res = await request(app)
      .post('/api/v1/cart/items')
      .send({ productId: 'invalid', quantity: 1 });
    expect(res.status).toBe(401);
  });
});

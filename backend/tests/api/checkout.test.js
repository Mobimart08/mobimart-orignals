import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Checkout and Order API Endpoints', () => {
  it('should deny access to create order without auth token', async () => {
    const res = await request(app).post('/api/v1/orders').send({});
    expect(res.status).toBe(401);
  });

  it('should deny access to get user orders without auth token', async () => {
    const res = await request(app).get('/api/v1/orders/my-orders');
    expect(res.status).toBe(401);
  });
});

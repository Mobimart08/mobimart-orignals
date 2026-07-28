import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Admin API Endpoints', () => {
  it('should deny access to admin dashboard stats without auth token', async () => {
    const res = await request(app).get('/api/v1/admin/dashboard/stats');
    expect(res.status).toBe(401);
  });

  it('should deny access to fetch users without auth token', async () => {
    const res = await request(app).get('/api/v1/admin/users');
    expect(res.status).toBe(401);
  });
});

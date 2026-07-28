import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';

const redisStore = new Map();
const redisMock = {
  isReady: true,
  async get(key) {
    return redisStore.has(key) ? redisStore.get(key) : null;
  },
  async setEx(key, _ttl, value) {
    redisStore.set(key, value);
    return 'OK';
  },
  async del(keys) {
    const keyList = Array.isArray(keys) ? keys : [keys];
    let deleted = 0;
    for (const key of keyList) {
      if (redisStore.delete(key)) {
        deleted += 1;
      }
    }
    return deleted;
  },
  async incr(key) {
    const nextValue = Number(redisStore.get(key) || 0) + 1;
    redisStore.set(key, String(nextValue));
    return nextValue;
  },
  async expire(_key, _ttl) {
    return 1;
  },
};

vi.mock('../../src/config/redis.js', () => ({
  default: redisMock,
}));

vi.mock('../../src/services/email.service.js', () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(null),
  sendWelcomeEmail: vi.fn().mockResolvedValue(null),
  sendForgotPasswordEmail: vi.fn().mockResolvedValue(null),
  sendPasswordChangedEmail: vi.fn().mockResolvedValue(null),
}));

let app;
let User;
let Token;
let Cart;
let Wishlist;
let Address;
let signAccessToken;
let signRefreshToken;
let hashToken;
let getRefreshTokenExpiry;

const createVerifiedUser = async (overrides = {}) => {
  const password = overrides.password || 'Password123!';
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: overrides.name || 'Test User',
    email: overrides.email || 'test@example.com',
    phone: overrides.phone,
    passwordHash,
    role: overrides.role || 'customer',
    isEmailVerified: overrides.isEmailVerified ?? true,
    isActive: overrides.isActive ?? true,
  });

  return { user, password };
};

const createSession = async (user, rememberMe = false) => {
  const accessToken = signAccessToken(user._id, user.role);
  const refreshToken = signRefreshToken(user._id, rememberMe);

  await Token.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    type: 'refresh',
    expiresAt: getRefreshTokenExpiry(rememberMe),
    userAgent: 'vitest',
    ipAddress: '127.0.0.1',
  });

  return {
    accessToken,
    refreshCookie: `refreshToken=${refreshToken}`,
  };
};

beforeAll(async () => {
  ({ default: app } = await import('../../src/app.js'));
  ({ default: User } = await import('../../src/models/User.model.js'));
  ({ default: Token } = await import('../../src/models/Token.model.js'));
  ({ default: Cart } = await import('../../src/models/Cart.model.js'));
  ({ default: Wishlist } = await import('../../src/models/Wishlist.model.js'));
  ({ default: Address } = await import('../../src/models/Address.model.js'));
  ({ signAccessToken, signRefreshToken, hashToken, getRefreshTokenExpiry } = await import('../../src/utils/generateToken.js'));
});

beforeEach(() => {
  redisStore.clear();
  redisMock.isReady = true;
});

describe('Authentication production regression coverage', () => {
  it('returns the authenticated profile without crashing on cached auth state', async () => {
    const { user, password } = await createVerifiedUser();

    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password });

    expect(loginResponse.status).toBe(200);

    const meResponse = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.data.email).toBe(user.email);
  });

  it('allows logout using only the refresh cookie and revokes the session', async () => {
    const { user, password } = await createVerifiedUser();

    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password });

    const refreshCookie = loginResponse.headers['set-cookie'][0].split(';')[0];

    const logoutResponse = await request(app)
      .post('/api/v1/auth/logout')
      .set('Cookie', refreshCookie);

    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.headers['set-cookie'][0]).toContain('refreshToken=');

    const refreshResponse = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', refreshCookie);

    expect(refreshResponse.status).toBe(401);
  });

  it('does not rate-limit repeated refresh rotations like login attempts', async () => {
    const { user, password } = await createVerifiedUser();
    const agent = request.agent(app);

    const loginResponse = await agent
      .post('/api/v1/auth/login')
      .send({ email: user.email, password });

    expect(loginResponse.status).toBe(200);

    for (let index = 0; index < 20; index += 1) {
      const refreshResponse = await agent.post('/api/v1/auth/refresh').send({});
      expect(refreshResponse.status).toBe(200);
    }
  });

  it('atomically rotates refresh tokens so one old cookie cannot mint multiple sessions', async () => {
    const { user, password } = await createVerifiedUser({ email: 'race@example.com' });

    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password });

    const refreshCookie = loginResponse.headers['set-cookie'][0].split(';')[0];

    const [firstRefresh, secondRefresh] = await Promise.all([
      request(app).post('/api/v1/auth/refresh').set('Cookie', refreshCookie),
      request(app).post('/api/v1/auth/refresh').set('Cookie', refreshCookie),
    ]);

    expect([firstRefresh.status, secondRefresh.status].sort()).toEqual([200, 401]);
    expect(await Token.countDocuments({ userId: user._id, type: 'refresh' })).toBe(1);
  });

  it('keeps login working when Redis is unavailable', async () => {
    const { user, password } = await createVerifiedUser({ email: 'redis-offline@example.com' });
    redisMock.isReady = false;

    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.data.user.email).toBe(user.email);
  });

  it('deletes account-owned auth data and allows re-registration with the same email', async () => {
    const { user } = await createVerifiedUser({
      email: 'delete-me@example.com',
      phone: '9876543210',
    });

    await Cart.create({ userId: user._id, items: [] });
    await Wishlist.create({ userId: user._id, productIds: [] });
    await Address.create({
      userId: user._id,
      label: 'Home',
      name: 'Delete Me',
      phone: '9876543210',
      addressLine1: '123 Test Street',
      city: 'Kolkata',
      state: 'West Bengal',
      pinCode: '700001',
      isDefault: true,
    });

    const { accessToken, refreshCookie } = await createSession(user);

    redisStore.set(`user:${user._id}`, JSON.stringify({ _id: String(user._id), email: user.email, isActive: true, role: 'customer' }));
    redisStore.set(`loginAttempts:${user._id}`, '2');
    redisStore.set(`loginLock:${user._id}`, '1');

    const deleteResponse = await request(app)
      .delete('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Cookie', refreshCookie);

    expect(deleteResponse.status).toBe(200);
    expect(await User.findById(user._id)).toBeNull();
    expect(await Token.countDocuments({ userId: user._id })).toBe(0);
    expect(await Cart.countDocuments({ userId: user._id })).toBe(0);
    expect(await Wishlist.countDocuments({ userId: user._id })).toBe(0);
    expect(await Address.countDocuments({ userId: user._id })).toBe(0);
    expect(redisStore.has(`user:${user._id}`)).toBe(false);
    expect(redisStore.has(`loginAttempts:${user._id}`)).toBe(false);
    expect(redisStore.has(`loginLock:${user._id}`)).toBe(false);

    const reRegisterResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Delete Me Again',
        email: user.email,
        password: 'Password123!',
        phone: '9876543210',
      });

    expect(reRegisterResponse.status).toBe(201);
  });
});

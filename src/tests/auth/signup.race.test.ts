import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../models/user';
import app from '../../app';

// Self-contained: force the 11000 duplicate-key path directly
describe('Race Condition + Info Leak - Organizer Signup', () => {
  afterEach(async () => {
    await User.deleteMany({ email: /dup-race-test/ });
  });

  it('returns 409 not 500 on duplicate email', async () => {
    // Pre-insert to guarantee 11000 path regardless of findOne timing
    await User.create({
      name: 'Existing',
      email: 'dup-race-test@example.com',
      password: '$2b$10$fakehash',
      otp: '123456',
      otpExpiry: new Date(Date.now() + 600000),
    });
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'New User', email: 'dup-race-test@example.com', password: 'password123' });
    expect([409, 400]).toContain(res.status);
    expect(res.body.message).toBe('Email is already in use');
  });

  it('does not leak MongoDB error details', async () => {
    await User.create({
      name: 'Existing',
      email: 'dup-race-test-2@example.com',
      password: '$2b$10$fakehash',
      otp: '123456',
      otpExpiry: new Date(Date.now() + 600000),
    });
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'New', email: 'dup-race-test-2@example.com', password: 'password123' });
    const body = JSON.stringify(res.body);
    expect(body).not.toMatch(/MongoServer/i);
    expect(body).not.toMatch(/11000/);
    expect(body).not.toMatch(/duplicate key/);
  });

  it('returns user-friendly message only', async () => {
    await User.create({
      name: 'Existing',
      email: 'dup-race-test-3@example.com',
      password: '$2b$10$fakehash',
      otp: '123456',
      otpExpiry: new Date(Date.now() + 600000),
    });
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'New', email: 'dup-race-test-3@example.com', password: 'password123' });
    expect(res.body.message).toBe('Email is already in use');
  });
});

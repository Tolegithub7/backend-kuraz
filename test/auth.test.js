const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Authentication', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message');
  });

  it('should login with valid credentials', async () => {
    // First register
    await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'password123' });

    // Then login
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
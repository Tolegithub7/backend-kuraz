const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('Chatbot', () => {
  let token;

  beforeAll(async () => {
    // Create test user and get token
    await request(app)
      .post('/auth/register')
      .send({ email: 'chatbot@test.com', password: 'password123' });

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'chatbot@test.com', password: 'password123' });
    
    token = loginRes.body.token;
  });

  it('should respond to authenticated requests', async () => {
    const res = await request(app)
      .post('/chatbot/ask')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'How to manage tasks?' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('response');
  });

  it('should reject unauthorized requests', async () => {
    const res = await request(app)
      .post('/chatbot/ask')
      .send({ message: 'Test message' });
    
    expect(res.statusCode).toEqual(401);
  });
});
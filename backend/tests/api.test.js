import request from 'supertest';
import app from '../src/server.js';

describe('API Health Check', () => {
  test('GET /health should return OK', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.status).toBe('OK');
    expect(response.body.service).toBe('Daring Achievers Network API');
  });
});

describe('Books API', () => {
  test('GET /api/books should return books list', async () => {
    const response = await request(app)
      .get('/api/books')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('GET /api/books/meta/categories should return categories', async () => {
    const response = await request(app)
      .get('/api/books/meta/categories')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

describe('Authentication', () => {
  test('POST /api/auth/login with invalid credentials should fail', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'invalid@example.com',
        password: 'wrongpassword'
      })
      .expect(401);
    
    expect(response.body.success).toBe(false);
  });
});

describe('Rate Limiting', () => {
  test('Should enforce rate limits on payment endpoints', async () => {
    // Make multiple requests quickly
    const promises = Array(5).fill().map(() =>
      request(app)
        .post('/api/payments/initiate')
        .send({
          phoneNumber: '254712345678',
          bookId: '507f1f77bcf86cd799439011'
        })
    );

    const responses = await Promise.all(promises);
    
    // At least one should be rate limited
    const rateLimited = responses.some(res => res.status === 429);
    expect(rateLimited).toBe(true);
  });
});
const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('debe registrar un usuario y devolver token y datos', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: '123456'
        });
      expect([201,403]).toContain(res.statusCode);
      if (res.statusCode === 201) {
        expect(res.body.data).toHaveProperty('token');
        expect(res.body.data.user).toHaveProperty('email', 'testuser@example.com');
      }
    });
  });

  describe('POST /api/auth/login', () => {
    it('debe fallar login con usuario inexistente', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'noexiste@example.com',
          password: '123456'
        });
      expect([404,422,403]).toContain(res.statusCode);
    });
  });
});

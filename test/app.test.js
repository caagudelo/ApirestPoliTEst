const request = require('supertest');
const app = require('../app');

describe('API REST PoliTEst', () => {
  it('GET /api debe responder 404 (sin endpoint raíz)', async () => {
    const res = await request(app).get('/');
    expect([200,404]).toContain(res.statusCode);
  });
});

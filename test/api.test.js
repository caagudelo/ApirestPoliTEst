const request = require('supertest');
const app = require('../app');

describe('Pacientes API', () => {
  it('GET /api/pacientes debe requerir autenticación', async () => {
    const res = await request(app).get('/api/pacientes');
    expect([401,403]).toContain(res.statusCode);
  });

  it('POST /api/pacientes debe requerir autenticación', async () => {
    const res = await request(app)
      .post('/api/pacientes')
      .send({
        id: 'testid',
        nombre: 'Paciente Test',
        telefono: '3001234567',
        email: 'paciente@test.com',
        fecha_nacimiento: '1990-01-01',
        direccion: 'Calle 123'
      });
    expect([401,403]).toContain(res.statusCode);
  });
});

describe('Citas API', () => {
  it('GET /api/citas debe requerir autenticación', async () => {
    const res = await request(app).get('/api/citas');
    expect([401,403]).toContain(res.statusCode);
  });

  it('POST /api/citas debe requerir autenticación', async () => {
    const res = await request(app)
      .post('/api/citas')
      .send({
        paciente_id: 'testid',
        fecha: '2025-10-05',
        hora: '10:30',
        especialidad: 'Medicina General'
      });
    expect([401,403]).toContain(res.statusCode);
  });
});

const { getContactInfo, getDeveloperInfo } = require('../controllers/contact');
const httpMocks = require('node-mocks-http');

describe('Contact Controller - Errores', () => {
  it('getContactInfo responde con error interno', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    // Forzar error lanzando excepción
    const original = Object.getOwnPropertyDescriptor(global, 'process');
    Object.defineProperty(global, 'process', { value: null });
    try {
      getContactInfo(req, res);
    } catch (e) {
      // Ignorar
    }
    expect([500, 403]).toContain(res.statusCode);
    Object.defineProperty(global, 'process', original);
  });

  it('getDeveloperInfo responde con error interno', () => {
    // Enviar body con forceError para disparar el error
    const req = httpMocks.createRequest({ body: { forceError: true } });
    const res = httpMocks.createResponse();
    getDeveloperInfo(req, res);
    expect([500, 403]).toContain(res.statusCode);
  });
});

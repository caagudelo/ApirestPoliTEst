const { getContactInfo, getDeveloperInfo } = require('../controllers/contact');
const httpMocks = require('node-mocks-http');

describe('Contact Controller', () => {
  it('getContactInfo responde 200 y datos de contacto', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    getContactInfo(req, res);
    expect(res.statusCode).toBe(200);
    const body = typeof res._getData() === 'string' ? JSON.parse(res._getData()) : res._getData();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('developer');
    expect(body.data).toHaveProperty('project');
    expect(body.data).toHaveProperty('api');
  });

  it('getDeveloperInfo responde 200 y datos básicos', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    getDeveloperInfo(req, res);
    expect(res.statusCode).toBe(200);
    const body = typeof res._getData() === 'string' ? JSON.parse(res._getData()) : res._getData();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('name');
    expect(body.data).toHaveProperty('email');
    expect(body.data).toHaveProperty('github');
  });
});

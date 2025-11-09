const { registerCtrl, loginCtrl } = require('../controllers/auth');
const { usersModel } = require('../models');
const httpMocks = require('node-mocks-http');
const { encrypt } = require('../utils/handlePassword');
const { tokenSign } = require('../utils/handleJwt');

jest.mock('../models');
jest.mock('../utils/handlePassword');
jest.mock('../utils/handleJwt');

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerCtrl', () => {
    it('debe registrar usuario y devolver token', async () => {
      const req = httpMocks.createRequest({
        body: { name: 'Test', email: 'test@example.com', password: '123456' }
      });
      const res = httpMocks.createResponse();
      encrypt.mockResolvedValue('hashedpass');
      usersModel.create.mockResolvedValue({
        set: jest.fn(),
        email: 'test@example.com',
        name: 'Test',
        password: 'hashedpass',
      });
      tokenSign.mockResolvedValue('token123');

  await registerCtrl(req, res);
  expect(res.statusCode).toBe(201);
  const body = res._getData();
  const data = typeof body === 'string' ? JSON.parse(body).data : body.data;
  expect(data).toHaveProperty('token', 'token123');
  expect(data.user).toHaveProperty('email', 'test@example.com');
    });
  });

  describe('loginCtrl', () => {
    it('debe fallar si el usuario no existe', async () => {
      const req = httpMocks.createRequest({ body: { email: 'no@existe.com', password: '123456' } });
      const res = httpMocks.createResponse();
      usersModel.findOne.mockResolvedValue(null);
  await loginCtrl(req, res);
  expect(res.statusCode).toBe(404);
  const body = res._getData();
  const result = typeof body === 'string' ? JSON.parse(body) : body;
  expect(result).toHaveProperty('error');
    });
  });
});

const { loginCtrl, registerCtrl } = require('../controllers/auth');
const httpMocks = require('node-mocks-http');
const { usersModel } = require('../models');
const { matchedData } = require('express-validator');
const { encrypt } = require('../utils/handlePassword');
const { tokenSign } = require('../utils/handleJwt');

jest.mock('../models');
jest.mock('express-validator');
jest.mock('../utils/handlePassword');
jest.mock('../utils/handleJwt');

matchedData.mockImplementation((req) => req.body);

describe('Auth Controller - Errores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registerCtrl responde con error si falla el registro', async () => {
    const req = httpMocks.createRequest({ body: { email: 'fail@test.com', password: '123' } });
    const res = httpMocks.createResponse();
    encrypt.mockRejectedValue(new Error('Fallo en hash'));
  await registerCtrl(req, res);
  const body = res._getData();
  expect(body).toHaveProperty('error');
  expect(body.error).toMatch(/ERROR_EN_REGISTER/);
  expect([500, 403]).toContain(res.statusCode);
  });

  it('loginCtrl responde con error si usuario no existe', async () => {
    const req = httpMocks.createRequest({ body: { email: 'noexiste@test.com', password: '123' } });
    const res = httpMocks.createResponse();
    usersModel.findOne.mockResolvedValue(null);
  await loginCtrl(req, res);
  const body = res._getData();
  expect(body).toHaveProperty('error');
  expect(body.error).toMatch(/USER_NOT_EXISTS/);
  expect(res.statusCode).toBe(404);
  });

  it('loginCtrl responde con error si email no coincide', async () => {
    const req = httpMocks.createRequest({ body: { email: 'otro@test.com', password: '123' } });
    const res = httpMocks.createResponse();
    usersModel.findOne.mockResolvedValue({ email: 'diferente@test.com', get: () => 'hash' });
  await loginCtrl(req, res);
  const body = res._getData();
  expect(body).toHaveProperty('error');
  expect(body.error).toMatch(/USER_NOT_EXISTS/);
  expect(res.statusCode).toBe(404);
  });

  it('loginCtrl responde con error si la contraseña es inválida', async () => {
    const req = httpMocks.createRequest({ body: { email: 'test@test.com', password: '123' } });
    const res = httpMocks.createResponse();
    usersModel.findOne.mockResolvedValue({ email: 'test@test.com', get: () => 'hash', set: jest.fn() });
    encrypt.mockResolvedValue('hash');
    require('../utils/handlePassword').compare = jest.fn().mockResolvedValue(false);
  await loginCtrl(req, res);
  const body = res._getData();
  expect(body).toHaveProperty('error');
  expect(body.error).toMatch(/PASSWORD_INVALID/);
  expect(res.statusCode).toBe(401);
  });

  it('loginCtrl responde con error interno', async () => {
    const req = httpMocks.createRequest({ body: { email: 'test@test.com', password: '123' } });
    const res = httpMocks.createResponse();
    usersModel.findOne.mockRejectedValue(new Error('DB error'));
  await loginCtrl(req, res);
  const body = res._getData();
  expect(body).toHaveProperty('error');
  expect(body.error).toMatch(/ERROR_EN_LOGIN/);
  expect([500, 403]).toContain(res.statusCode);
  });
});

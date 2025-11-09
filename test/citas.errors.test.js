const { createCita, getCitas, getCita, updateCita, deleteCita } = require('../controllers/citas');
const httpMocks = require('node-mocks-http');
const { citasModel } = require('../models');
const { matchedData } = require('express-validator');

jest.mock('../models');
jest.mock('express-validator');

matchedData.mockImplementation((req) => req.body);

describe('Citas Controller - Errores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createCita responde con error si falla la creación', async () => {
    const req = httpMocks.createRequest({ body: { paciente_id: 'fail' } });
    const res = httpMocks.createResponse();
    citasModel.create.mockRejectedValue(new Error('DB error'));
  await createCita(req, res);
  const body = res._getData();
  expect(body).toHaveProperty('error');
  expect(body.error).toMatch(/ERROR_EN_CREATE_CITA/);
  expect([500, 403]).toContain(res.statusCode);
  });

  it('getCitas responde con error si falla la consulta', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    citasModel.findAll = null;
    citasModel.find = jest.fn().mockRejectedValue(new Error('DB error'));
  await getCitas(req, res);
  const body = res._getData();
  expect(body).toHaveProperty('error');
  expect(body.error).toMatch(/ERROR_EN_GET_CITAS/);
  expect([500, 403]).toContain(res.statusCode);
  });

  it('getCita responde con error si falla la consulta por id', async () => {
    const req = httpMocks.createRequest({ body: { id: 'fail' } });
    const res = httpMocks.createResponse();
    citasModel.findByPk = null;
    citasModel.findById = jest.fn().mockRejectedValue(new Error('DB error'));
  await getCita(req, res);
  const body = res._getData();
  expect(body).toHaveProperty('error');
  expect(body.error).toMatch(/ERROR_EN_GET_CITA/);
  expect([500, 403]).toContain(res.statusCode);
  });

  it('updateCita responde con error si falla la actualización', async () => {
    const req = httpMocks.createRequest({ body: { id: 'fail' } });
    const res = httpMocks.createResponse();
    citasModel.update = null;
    citasModel.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('DB error'));
  await updateCita(req, res);
  const body = res._getData();
  expect(body).toHaveProperty('error');
  expect(body.error).toMatch(/ERROR_EN_UPDATE_CITA/);
  expect([500, 403]).toContain(res.statusCode);
  });

  it('deleteCita responde con error si falla el borrado', async () => {
    const req = httpMocks.createRequest({ body: { id: 'fail' } });
    const res = httpMocks.createResponse();
    citasModel.update = null;
    citasModel.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('DB error'));
  await deleteCita(req, res);
  const body = res._getData();
  expect(body).toHaveProperty('error');
  expect(body.error).toMatch(/ERROR_EN_DELETE_CITA/);
  expect([500, 403]).toContain(res.statusCode);
  });
});

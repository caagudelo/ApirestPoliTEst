const { getHistoria, createPaciente, getPacientes, addHistoriaRecord } = require('../controllers/pacientes');
const httpMocks = require('node-mocks-http');
const { pacientesModel, historiaClinicaModel } = require('../models');
const { matchedData } = require('express-validator');

jest.mock('../models');
jest.mock('express-validator');

matchedData.mockImplementation((req) => req.body);

describe('Pacientes Controller - Errores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getHistoria responde con error si paciente no existe', async () => {
    const req = httpMocks.createRequest({ body: { paciente_id: 'noexiste' } });
    const res = httpMocks.createResponse();
    pacientesModel.findOne.mockResolvedValue(null);
  await getHistoria(req, res);
  const body = res._getData();
  expect(body).toHaveProperty('error');
  expect(body.error).toMatch(/PACIENTE_NOT_FOUND/);
  expect(res.statusCode).toBe(404);
  });

  it('getHistoria responde con error interno', async () => {
    const req = httpMocks.createRequest({ body: { paciente_id: 'error' } });
    const res = httpMocks.createResponse();
    pacientesModel.findOne.mockRejectedValue(new Error('DB error'));
    await getHistoria(req, res);
    const body = res._getData();
    expect(body).toHaveProperty('error');
    expect(body.error).toMatch(/ERROR_GETTING_HISTORIA/);
    expect([500, 403]).toContain(res.statusCode);
  });

  it('createPaciente responde con error interno', async () => {
    const req = httpMocks.createRequest({ body: { nombre: 'error' } });
    const res = httpMocks.createResponse();
    pacientesModel.create.mockRejectedValue(new Error('DB error'));
    await createPaciente(req, res);
    const body = res._getData();
    expect(body).toHaveProperty('error');
    expect(body.error).toMatch(/ERROR_CREATING_PACIENTE/);
    expect([500, 403]).toContain(res.statusCode);
  });

  it('getPacientes responde con error interno', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    pacientesModel.findAll.mockRejectedValue(new Error('DB error'));
    await getPacientes(req, res);
    const body = res._getData();
    expect(body).toHaveProperty('error');
    expect(body.error).toMatch(/ERROR_GETTING_PACIENTES/);
    expect([500, 403]).toContain(res.statusCode);
  });

  it('addHistoriaRecord responde con error si paciente no existe', async () => {
    const req = httpMocks.createRequest({ body: { paciente_id: 'noexiste' } });
    const res = httpMocks.createResponse();
    pacientesModel.findOne.mockResolvedValue(null);
  await addHistoriaRecord(req, res);
  const body = res._getData();
  expect(body).toHaveProperty('error');
  expect(body.error).toMatch(/PACIENTE_NOT_FOUND/);
  expect(res.statusCode).toBe(404);
  });

  it('addHistoriaRecord responde con error interno', async () => {
    const req = httpMocks.createRequest({ body: { paciente_id: 'error' } });
    const res = httpMocks.createResponse();
    pacientesModel.findOne.mockRejectedValue(new Error('DB error'));
  await addHistoriaRecord(req, res);
  const body = res._getData();
  expect(body).toHaveProperty('error');
  expect(body.error).toMatch(/ERROR_ADDING_HISTORIA_RECORD/);
  expect([500, 403]).toContain(res.statusCode);
  });
});

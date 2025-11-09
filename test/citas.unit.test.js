const { createCita, getCitas, getCita, updateCita, deleteCita } = require('../controllers/citas');
const { citasModel } = require('../models');
const httpMocks = require('node-mocks-http');
const { matchedData } = require('express-validator');

jest.mock('../models');
jest.mock('express-validator');

matchedData.mockImplementation((req) => req.body);

describe('Citas Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createCita responde 201 y cita confirmada', async () => {
    const req = httpMocks.createRequest({ body: { paciente_id: 'p1', fecha: '2025-10-05', hora: '10:30', especialidad: 'General' } });
    const res = httpMocks.createResponse();
    citasModel.create.mockResolvedValue({ id: 'cita123' });
    await createCita(req, res);
    expect(res.statusCode).toBe(201);
    const body = typeof res._getData() === 'string' ? JSON.parse(res._getData()) : res._getData();
    expect(body).toHaveProperty('cita_id');
    expect(body).toHaveProperty('estado', 'confirmada');
  });

  it('getCitas responde con array de citas', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    citasModel.findAll = jest.fn().mockResolvedValue([{ id: 'cita1' }, { id: 'cita2' }]);
    await getCitas(req, res);
    const body = typeof res._getData() === 'string' ? JSON.parse(res._getData()) : res._getData();
    expect(body.data).toBeInstanceOf(Array);
  });

  it('getCita responde con cita por id', async () => {
    const req = httpMocks.createRequest({ body: { id: 'cita1' } });
    const res = httpMocks.createResponse();
    citasModel.findByPk = jest.fn().mockResolvedValue({ id: 'cita1' });
    await getCita(req, res);
    const body = typeof res._getData() === 'string' ? JSON.parse(res._getData()) : res._getData();
    expect(body.data).toHaveProperty('id', 'cita1');
  });

  it('updateCita responde con cita actualizada', async () => {
    const req = httpMocks.createRequest({ body: { id: 'cita1', estado: 'confirmada' } });
    const res = httpMocks.createResponse();
    citasModel.update = jest.fn().mockResolvedValue();
    citasModel.findByPk = jest.fn().mockResolvedValue({ id: 'cita1', estado: 'confirmada' });
    await updateCita(req, res);
    const body = typeof res._getData() === 'string' ? JSON.parse(res._getData()) : res._getData();
    expect(body.data).toHaveProperty('estado', 'confirmada');
  });

  it('deleteCita responde con cita cancelada', async () => {
    const req = httpMocks.createRequest({ body: { id: 'cita1' } });
    const res = httpMocks.createResponse();
    citasModel.update = jest.fn().mockResolvedValue();
    citasModel.findByPk = jest.fn().mockResolvedValue({ id: 'cita1', estado: 'cancelada' });
    await deleteCita(req, res);
    const body = typeof res._getData() === 'string' ? JSON.parse(res._getData()) : res._getData();
    expect(body.data).toHaveProperty('estado', 'cancelada');
  });
});

const { getHistoria, createPaciente, getPacientes, addHistoriaRecord } = require('../controllers/pacientes');
const { pacientesModel, historiaClinicaModel } = require('../models');
const httpMocks = require('node-mocks-http');
const { matchedData } = require('express-validator');

jest.mock('../models');
jest.mock('express-validator');

matchedData.mockImplementation((req) => req.body);

describe('Pacientes Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getHistoria responde con datos del paciente', async () => {
    const req = httpMocks.createRequest({ body: { paciente_id: 'p1' } });
    const res = httpMocks.createResponse();
    pacientesModel.findOne.mockResolvedValue({ id: 'p1', nombre: 'Paciente Test' });
    historiaClinicaModel.findAll.mockResolvedValueOnce([
      { fecha: new Date('2025-10-05'), descripcion: 'Gripe', medico: 'Dr. García' }
    ]).mockResolvedValueOnce([
      { descripcion: 'Paracetamol' }
    ]);
    await getHistoria(req, res);
    const body = typeof res._getData() === 'string' ? JSON.parse(res._getData()) : res._getData();
    expect(body.data).toHaveProperty('paciente_id', 'p1');
    expect(body.data).toHaveProperty('diagnosticos');
    expect(body.data).toHaveProperty('medicamentos');
  });

  it('createPaciente responde 201 y datos', async () => {
    const req = httpMocks.createRequest({ body: { id: 'p2', nombre: 'Nuevo Paciente' } });
    const res = httpMocks.createResponse();
    pacientesModel.create.mockResolvedValue({ id: 'p2', nombre: 'Nuevo Paciente' });
    await createPaciente(req, res);
    expect(res.statusCode).toBe(201);
    const body = typeof res._getData() === 'string' ? JSON.parse(res._getData()) : res._getData();
    expect(body.data).toHaveProperty('id', 'p2');
  });

  it('getPacientes responde con array de pacientes', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    pacientesModel.findAll.mockResolvedValue([{ id: 'p1', nombre: 'Paciente Test' }]);
    await getPacientes(req, res);
    const body = typeof res._getData() === 'string' ? JSON.parse(res._getData()) : res._getData();
    expect(body.data).toBeInstanceOf(Array);
  });

  it('addHistoriaRecord responde 201 y datos', async () => {
    const req = httpMocks.createRequest({ body: { paciente_id: 'p1', tipo_registro: 'diagnostico', descripcion: 'Gripe' } });
    const res = httpMocks.createResponse();
    pacientesModel.findOne.mockResolvedValue({ id: 'p1', nombre: 'Paciente Test' });
    historiaClinicaModel.create.mockResolvedValue({ id: 'r1', descripcion: 'Gripe' });
    await addHistoriaRecord(req, res);
    expect(res.statusCode).toBe(201);
    const body = typeof res._getData() === 'string' ? JSON.parse(res._getData()) : res._getData();
    expect(body.data).toHaveProperty('id', 'r1');
  });
});

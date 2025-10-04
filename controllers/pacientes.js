const { matchedData, check } = require("express-validator");
const { pacientesModel, historiaClinicaModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");

/**
 * Obtener la historia clínica de un paciente
 * @param {*} req 
 * @param {*} res 
 */
const getHistoria = async (req, res) => {
    try {
        const { paciente_id } = matchedData(req);
        
        // Buscar el paciente
        const paciente = await pacientesModel.findOne({
            where: { id: paciente_id, activo: true }
        });

        if (!paciente) {
            handleHttpError(res, "PACIENTE_NOT_FOUND", 404);
            return;
        }

        // Buscar diagnósticos
        const diagnosticos = await historiaClinicaModel.findAll({
            where: { 
                paciente_id: paciente_id,
                tipo_registro: 'diagnostico'
            },
            order: [['fecha', 'DESC']],
            attributes: ['fecha', 'descripcion', 'medico']
        });

        // Buscar medicamentos
        const medicamentos = await historiaClinicaModel.findAll({
            where: { 
                paciente_id: paciente_id,
                tipo_registro: 'medicamento'
            },
            order: [['fecha', 'DESC']],
            attributes: ['descripcion']
        });

        // Formatear la respuesta
        const response = {
            paciente_id: paciente.id,
            nombre: paciente.nombre,
            diagnosticos: diagnosticos.map(d => ({
                fecha: d.fecha.toISOString().split('T')[0], // Formato YYYY-MM-DD
                descripcion: d.descripcion,
                medico: d.medico
            })),
            medicamentos: medicamentos.map(m => m.descripcion)
        };

        res.send({ data: response });

    } catch (error) {
        console.log("Error en getHistoria:", error);
        handleHttpError(res, "ERROR_GETTING_HISTORIA", 500);
    }
};

/**
 * Crear un nuevo paciente
 * @param {*} req 
 * @param {*} res 
 */
const createPaciente = async (req, res) => {
    try {
        req = matchedData(req);
        const dataPaciente = await pacientesModel.create(req);
        
        res.status(201);
        res.send({ data: dataPaciente });
    } catch (error) {
        console.log("Error en createPaciente:", error);
        handleHttpError(res, "ERROR_CREATING_PACIENTE", 500);
    }
};

/**
 * Obtener todos los pacientes
 * @param {*} req 
 * @param {*} res 
 */
const getPacientes = async (req, res) => {
    try {
        console.log("🔍 Obteniendo lista de pacientes...");
        
        const pacientes = await pacientesModel.findAll({
            where: { activo: true },
            attributes: ['id', 'nombre', 'telefono', 'email', 'createdAt']
        });
        
        console.log(`✅ Se encontraron ${pacientes.length} pacientes`);
        res.send({ data: pacientes });
    } catch (error) {
        console.log("❌ Error en getPacientes:", error.message);
        handleHttpError(res, "ERROR_GETTING_PACIENTES", 500);
    }
};

/**
 * Agregar registro a la historia clínica
 * @param {*} req 
 * @param {*} res 
 */
const addHistoriaRecord = async (req, res) => {
    try {
        req = matchedData(req);
        
        // Verificar que el paciente existe
        const paciente = await pacientesModel.findOne({
            where: { id: req.paciente_id, activo: true }
        });

        if (!paciente) {
            handleHttpError(res, "PACIENTE_NOT_FOUND", 404);
            return;
        }

        const dataRecord = await historiaClinicaModel.create(req);
        
        res.status(201);
        res.send({ data: dataRecord });
    } catch (error) {
        console.log("Error en addHistoriaRecord:", error);
        handleHttpError(res, "ERROR_ADDING_HISTORIA_RECORD", 500);
    }
};

module.exports = { 
    getHistoria, 
    createPaciente, 
    getPacientes, 
    addHistoriaRecord 
};

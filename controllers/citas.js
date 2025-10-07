const { matchedData } = require("express-validator");
const { citasModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");

/**
 * Crear una nueva cita médica
 * @param {*} req - Request object
 * @param {*} res - Response object
 */
const createCita = async (req, res) => {
    try {
        // Limpia los datos del request y solo deja los campos válidos
        const body = matchedData(req);
        
        // Crear la cita en la base de datos
        const data = await citasModel.create(body);
        
        // Generar un ID único para la respuesta (simulando un ID de cita)
        const cita_id = data._id || data.id || Math.random().toString(36).substr(2, 9);
        
        // Respuesta exitosa con el formato solicitado
        res.status(201).json({
            cita_id: cita_id,
            estado: "confirmada",
            paciente_id: body.paciente_id,
            mensaje: "Cita creada exitosamente"
        });
        
    } catch (e) {
        console.error("Error al crear cita:", e);
        handleHttpError(res, "ERROR_EN_CREATE_CITA: " + e);
    }
};

/**
 * Obtener todas las citas
 * @param {*} req - Request object
 * @param {*} res - Response object
 */
const getCitas = async (req, res) => {
    try {
        // Usar el método nativo de la base de datos
        // Para Sequelize (MySQL) usamos findAll, para Mongoose (NoSQL) usamos find
        const data = await citasModel.findAll ? 
            await citasModel.findAll({}) : 
            await citasModel.find({});
        res.send({ data });
    } catch (e) {
        handleHttpError(res, "ERROR_EN_GET_CITAS: " + e);
    }
};

/**
 * Obtener una cita por ID
 * @param {*} req - Request object
 * @param {*} res - Response object
 */
const getCita = async (req, res) => {
    try {
        req = matchedData(req);
        const { id } = req;
        // Usar el método nativo de la base de datos
        // Para Sequelize (MySQL) usamos findByPk, para Mongoose (NoSQL) usamos findById
        const data = await citasModel.findByPk ? 
            await citasModel.findByPk(id) : 
            await citasModel.findById(id);
        res.send({ data });
    } catch (e) {
        handleHttpError(res, "ERROR_EN_GET_CITA: " + e);
    }
};

/**
 * Actualizar una cita
 * @param {*} req - Request object
 * @param {*} res - Response object
 */
const updateCita = async (req, res) => {
    try {
        const { id, ...body } = matchedData(req);
        // Usar el método nativo de la base de datos
        let data;
        if (citasModel.update) {
            // Para Sequelize (MySQL)
            await citasModel.update(body, { where: { id: id } });
            data = await citasModel.findByPk(id);
        } else {
            // Para Mongoose (NoSQL)
            data = await citasModel.findByIdAndUpdate(
                id, body,
                { new: true } // Retorna el documento actualizado
            );
        }
        res.send({ data });
    } catch (e) {
        handleHttpError(res, "ERROR_EN_UPDATE_CITA: " + e);
    }
};

/**
 * Eliminar una cita (borrado lógico)
 * @param {*} req - Request object
 * @param {*} res - Response object
 */
const deleteCita = async (req, res) => {
    try {
        req = matchedData(req);
        const { id } = req;
        // Usar el método nativo para borrado lógico
        let data;
        if (citasModel.update) {
            // Para Sequelize (MySQL)
            await citasModel.update({ estado: "cancelada" }, { where: { id: id } });
            data = await citasModel.findByPk(id);
        } else {
            // Para Mongoose (NoSQL)
            data = await citasModel.findByIdAndUpdate(
                id, 
                { estado: "cancelada" },
                { new: true }
            );
        }
        res.send({ data });
    } catch (e) {
        console.log(e);
        handleHttpError(res, "ERROR_EN_DELETE_CITA: " + e);
    }
};

module.exports = { 
    createCita, 
    getCitas, 
    getCita, 
    updateCita, 
    deleteCita 
};

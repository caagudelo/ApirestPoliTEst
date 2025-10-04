const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

// Validador para crear una cita médica
const validatorCreateCita = [
    check("paciente_id")
        .exists()
        .notEmpty()
        .withMessage("El ID del paciente es requerido")
        .isLength({ min: 1 })
        .withMessage("El ID del paciente no puede estar vacío"),
    
    check("fecha")
        .exists()
        .notEmpty()
        .withMessage("La fecha es requerida")
        .isDate()
        .withMessage("La fecha debe tener un formato válido (YYYY-MM-DD)"),
    
    check("hora")
        .exists()
        .notEmpty()
        .withMessage("La hora es requerida")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("La hora debe tener un formato válido (HH:MM)"),
    
    check("especialidad")
        .exists()
        .notEmpty()
        .withMessage("La especialidad es requerida")
        .isLength({ min: 2 })
        .withMessage("La especialidad debe tener al menos 2 caracteres"),
    
    (req, res, next) => {
        return validateResults(req, res, next);
    }
];

// Validador para obtener una cita por ID
const validatorGetCita = [
    check("id")
        .exists()
        .notEmpty()
        .withMessage("El ID de la cita es requerido"),
    
    (req, res, next) => {
        return validateResults(req, res, next);
    }
];

// Validador para actualizar una cita
const validatorUpdateCita = [
    check("id")
        .exists()
        .notEmpty()
        .withMessage("El ID de la cita es requerido"),
    
    check("paciente_id")
        .optional()
        .notEmpty()
        .withMessage("El ID del paciente no puede estar vacío"),
    
    check("fecha")
        .optional()
        .isDate()
        .withMessage("La fecha debe tener un formato válido (YYYY-MM-DD)"),
    
    check("hora")
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("La hora debe tener un formato válido (HH:MM)"),
    
    check("especialidad")
        .optional()
        .isLength({ min: 2 })
        .withMessage("La especialidad debe tener al menos 2 caracteres"),
    
    (req, res, next) => {
        return validateResults(req, res, next);
    }
];

module.exports = { 
    validatorCreateCita, 
    validatorGetCita, 
    validatorUpdateCita 
};

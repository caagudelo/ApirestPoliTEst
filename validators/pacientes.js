const { check } = require("express-validator");

/**
 * Validador para obtener historia clínica
 */
const validatorGetHistoria = [
    check("paciente_id")
        .notEmpty()
        .withMessage("El ID del paciente es requerido")
        .isLength({ min: 1, max: 50 })
        .withMessage("El ID del paciente debe tener entre 1 y 50 caracteres")
];

/**
 * Validador para crear paciente
 */
const validatorCreatePaciente = [
    check("id")
        .notEmpty()
        .withMessage("El ID del paciente es requerido")
        .isLength({ min: 1, max: 50 })
        .withMessage("El ID del paciente debe tener entre 1 y 50 caracteres"),
    check("nombre")
        .notEmpty()
        .withMessage("El nombre es requerido")
        .isLength({ min: 2, max: 100 })
        .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
    check("telefono")
        .optional()
        .isLength({ min: 7, max: 15 })
        .withMessage("El teléfono debe tener entre 7 y 15 caracteres"),
    check("email")
        .optional()
        .isEmail()
        .withMessage("El email debe tener un formato válido"),
    check("fecha_nacimiento")
        .optional()
        .isISO8601()
        .withMessage("La fecha de nacimiento debe tener formato YYYY-MM-DD")
];

/**
 * Validador para agregar registro a historia clínica
 */
const validatorAddHistoriaRecord = [
    check("paciente_id")
        .notEmpty()
        .withMessage("El ID del paciente es requerido"),
    check("tipo_registro")
        .notEmpty()
        .withMessage("El tipo de registro es requerido")
        .isIn(["diagnostico", "medicamento", "procedimiento", "nota"])
        .withMessage("El tipo de registro debe ser: diagnostico, medicamento, procedimiento o nota"),
    check("descripcion")
        .notEmpty()
        .withMessage("La descripción es requerida")
        .isLength({ min: 3, max: 500 })
        .withMessage("La descripción debe tener entre 3 y 500 caracteres"),
    check("fecha")
        .optional()
        .isISO8601()
        .withMessage("La fecha debe tener formato YYYY-MM-DD"),
    check("medico")
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage("El nombre del médico debe tener entre 2 y 100 caracteres")
];

module.exports = {
    validatorGetHistoria,
    validatorCreatePaciente,
    validatorAddHistoriaRecord
};

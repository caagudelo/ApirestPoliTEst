/**
 * Validadores para información de contacto
 * Este archivo contiene las validaciones para los endpoints de contacto
 */

const { body, param, query } = require("express-validator");

/**
 * Validaciones para obtener información de contacto
 * No requiere validaciones específicas ya que es un GET sin parámetros
 */
const getContactInfoValidation = [];

/**
 * Validaciones para obtener información del desarrollador
 * No requiere validaciones específicas ya que es un GET sin parámetros
 */
const getDeveloperInfoValidation = [];

/**
 * Middleware para validar URLs (opcional, para futuras funcionalidades)
 */
const validateUrl = (field) => {
    return body(field)
        .optional()
        .isURL({ 
            protocols: ['http', 'https'],
            require_protocol: true 
        })
        .withMessage(`El campo ${field} debe ser una URL válida con protocolo http o https`);
};

/**
 * Validaciones para actualizar información de contacto (futura funcionalidad)
 */
const updateContactInfoValidation = [
    body('name')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres')
        .trim(),
    
    body('email')
        .optional()
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
        .normalizeEmail(),
    
    body('github')
        .optional()
        .isURL({ 
            protocols: ['https'],
            require_protocol: true 
        })
        .withMessage('GitHub debe ser una URL válida con protocolo https'),
    
    body('linkedin')
        .optional()
        .isURL({ 
            protocols: ['https'],
            require_protocol: true 
        })
        .withMessage('LinkedIn debe ser una URL válida con protocolo https'),
    
    body('portfolio')
        .optional()
        .isURL({ 
            protocols: ['http', 'https'],
            require_protocol: true 
        })
        .withMessage('Portfolio debe ser una URL válida con protocolo http o https')
];

module.exports = {
    getContactInfoValidation,
    getDeveloperInfoValidation,
    updateContactInfoValidation,
    validateUrl
};

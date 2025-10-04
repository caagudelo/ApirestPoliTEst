const express = require("express");
const { getHistoria, createPaciente, getPacientes, addHistoriaRecord } = require("../controllers/pacientes");
const router = express.Router();
const { validatorGetHistoria, validatorCreatePaciente, validatorAddHistoriaRecord } = require("../validators/pacientes");
const authMiddleware = require("../middleware/session");
const checkRol = require("../middleware/rol");

/**
 * Obtener historia clínica de un paciente
 * @openapi
 * /pacientes/{paciente_id}/historia:
 *    get:
 *      tags:
 *        - pacientes
 *      summary: "Obtener historia clínica de un paciente"
 *      description: Obtiene la historia clínica completa de un paciente incluyendo diagnósticos y medicamentos
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: paciente_id
 *          required: true
 *          schema:
 *            type: string
 *          description: ID único del paciente
 *      responses:
 *        '200':
 *          description: Historia clínica obtenida exitosamente
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: object
 *                    properties:
 *                      paciente_id:
 *                        type: string
 *                        example: "12345"
 *                      nombre:
 *                        type: string
 *                        example: "Carlos Gómez"
 *                      diagnosticos:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            fecha:
 *                              type: string
 *                              format: date
 *                              example: "2025-09-15"
 *                            descripcion:
 *                              type: string
 *                              example: "Gripe"
 *                            medico:
 *                              type: string
 *                              example: "Dr. García"
 *                      medicamentos:
 *                        type: array
 *                        items:
 *                          type: string
 *                        example: ["Losartán", "Paracetamol"]
 *        '404':
 *          description: Paciente no encontrado
 *        '401':
 *          description: No autorizado
 */
router.get("/:paciente_id/historia", 
    authMiddleware,
    checkRol(["admin", "user"]),
    validatorGetHistoria,
    getHistoria
);

/**
 * Obtener todos los pacientes
 * @openapi
 * /pacientes:
 *    get:
 *      tags:
 *        - pacientes
 *      summary: "Listar todos los pacientes"
 *      description: Obtiene una lista de todos los pacientes activos
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        '200':
 *          description: Lista de pacientes obtenida exitosamente
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                        nombre:
 *                          type: string
 *                        telefono:
 *                          type: string
 *                        email:
 *                          type: string
 *                        createdAt:
 *                          type: string
 *                          format: date-time
 *        '401':
 *          description: No autorizado
 */
router.get("/", 
    authMiddleware,
    checkRol(["admin", "user"]),
    getPacientes
);

/**
 * Crear un nuevo paciente
 * @openapi
 * /pacientes:
 *    post:
 *      tags:
 *        - pacientes
 *      summary: "Crear un nuevo paciente"
 *      description: Registra un nuevo paciente en el sistema
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - id
 *                - nombre
 *              properties:
 *                id:
 *                  type: string
 *                  example: "12345"
 *                nombre:
 *                  type: string
 *                  example: "Carlos Gómez"
 *                telefono:
 *                  type: string
 *                  example: "3001234567"
 *                email:
 *                  type: string
 *                  example: "carlos@email.com"
 *                fecha_nacimiento:
 *                  type: string
 *                  format: date
 *                  example: "1990-05-15"
 *                direccion:
 *                  type: string
 *                  example: "Calle 123 #45-67"
 *      responses:
 *        '201':
 *          description: Paciente creado exitosamente
 *        '400':
 *          description: Datos inválidos
 *        '401':
 *          description: No autorizado
 */
router.post("/", 
    authMiddleware,
    checkRol(["admin"]),
    validatorCreatePaciente,
    createPaciente
);

/**
 * Agregar registro a historia clínica
 * @openapi
 * /pacientes/historia:
 *    post:
 *      tags:
 *        - pacientes
 *      summary: "Agregar registro a historia clínica"
 *      description: Agrega un nuevo registro (diagnóstico, medicamento, etc.) a la historia clínica de un paciente
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - paciente_id
 *                - tipo_registro
 *                - descripcion
 *              properties:
 *                paciente_id:
 *                  type: string
 *                  example: "12345"
 *                tipo_registro:
 *                  type: string
 *                  enum: ["diagnostico", "medicamento", "procedimiento", "nota"]
 *                  example: "diagnostico"
 *                descripcion:
 *                  type: string
 *                  example: "Hipertensión controlada"
 *                fecha:
 *                  type: string
 *                  format: date
 *                  example: "2025-09-22"
 *                medico:
 *                  type: string
 *                  example: "Dr. García"
 *                observaciones:
 *                  type: string
 *                  example: "Paciente responde bien al tratamiento"
 *      responses:
 *        '201':
 *          description: Registro agregado exitosamente
 *        '400':
 *          description: Datos inválidos
 *        '404':
 *          description: Paciente no encontrado
 *        '401':
 *          description: No autorizado
 */
router.post("/historia", 
    authMiddleware,
    checkRol(["admin", "user"]),
    validatorAddHistoriaRecord,
    addHistoriaRecord
);

module.exports = router;

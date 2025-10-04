const express = require("express");
const router = express.Router();
const { createCita, getCitas, getCita, updateCita, deleteCita } = require("../controllers/citas");
const { validatorCreateCita, validatorGetCita, validatorUpdateCita } = require("../validators/citas");

/**
 * @swagger
 * /citas:
 *   post:
 *     summary: Crear una nueva cita médica
 *     tags: [Citas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paciente_id
 *               - fecha
 *               - hora
 *               - especialidad
 *             properties:
 *               paciente_id:
 *                 type: string
 *                 description: ID del paciente
 *                 example: "12345"
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la cita
 *                 example: "2025-10-05"
 *               hora:
 *                 type: string
 *                 description: Hora de la cita
 *                 example: "10:30"
 *               especialidad:
 *                 type: string
 *                 description: Especialidad médica
 *                 example: "Medicina General"
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cita_id:
 *                   type: string
 *                   example: "987"
 *                 estado:
 *                   type: string
 *                   example: "confirmada"
 *                 paciente_id:
 *                   type: string
 *                   example: "12345"
 *                 mensaje:
 *                   type: string
 *                   example: "Cita creada exitosamente"
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", validatorCreateCita, createCita);

/**
 * @swagger
 * /citas:
 *   get:
 *     summary: Obtener todas las citas
 *     tags: [Citas]
 *     responses:
 *       200:
 *         description: Lista de citas obtenida exitosamente
 */
router.get("/", getCitas);

/**
 * @swagger
 * /citas/{id}:
 *   get:
 *     summary: Obtener una cita por ID
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cita
 *     responses:
 *       200:
 *         description: Cita obtenida exitosamente
 *       404:
 *         description: Cita no encontrada
 */
router.get("/:id", validatorGetCita, getCita);

/**
 * @swagger
 * /citas/{id}:
 *   put:
 *     summary: Actualizar una cita
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paciente_id:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *               hora:
 *                 type: string
 *               especialidad:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cita actualizada exitosamente
 */
router.put("/:id", validatorUpdateCita, updateCita);

/**
 * @swagger
 * /citas/{id}:
 *   delete:
 *     summary: Eliminar una cita (borrado lógico)
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cita
 *     responses:
 *       200:
 *         description: Cita eliminada exitosamente
 */
router.delete("/:id", validatorGetCita, deleteCita);

module.exports = router;

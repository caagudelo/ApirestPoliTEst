/**
 * Rutas para información de contacto del desarrollador
 * Este archivo define las rutas relacionadas con la información de contacto
 */

const express = require("express");
const { getContactInfo, getDeveloperInfo } = require("../controllers/contact");
const { getContactInfoValidation, getDeveloperInfoValidation } = require("../validators/contact");

const router = express.Router();

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Obtener información completa de contacto del desarrollador
 *     description: Retorna información detallada del desarrollador, proyecto y API
 *     tags: [Contacto]
 *     responses:
 *       200:
 *         description: Información de contacto obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Información de contacto obtenida exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     developer:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Andrés Felipe"
 *                         email:
 *                           type: string
 *                           example: "andres18160@gmail.com"
 *                         github:
 *                           type: string
 *                           example: "https://github.com/andres18160"
 *                         linkedin:
 *                           type: string
 *                           example: "https://linkedin.com/in/andres-felipe"
 *                         portfolio:
 *                           type: string
 *                           example: "https://andresfelipe.dev"
 *                     project:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "API REST PoliTest"
 *                         version:
 *                           type: string
 *                           example: "1.0.0"
 *                         description:
 *                           type: string
 *                           example: "API REST para gestión de pacientes y citas médicas"
 *                         repository:
 *                           type: string
 *                           example: "https://github.com/andres18160/ApirestPoliTEst"
 *                         documentation:
 *                           type: string
 *                           example: "http://localhost:3000/documentacion"
 *                     api:
 *                       type: object
 *                       properties:
 *                         baseUrl:
 *                           type: string
 *                           example: "http://localhost:3000/api"
 *                         endpoints:
 *                           type: object
 *                           properties:
 *                             auth:
 *                               type: string
 *                               example: "/auth"
 *                             pacientes:
 *                               type: string
 *                               example: "/pacientes"
 *                             citas:
 *                               type: string
 *                               example: "/citas"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error interno del servidor"
 */
router.get("/", getContactInfoValidation, getContactInfo);

/**
 * @swagger
 * /contact/developer:
 *   get:
 *     summary: Obtener información básica del desarrollador
 *     description: Retorna información simplificada del desarrollador
 *     tags: [Contacto]
 *     responses:
 *       200:
 *         description: Información del desarrollador obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Andrés Felipe"
 *                     email:
 *                       type: string
 *                       example: "andres18160@gmail.com"
 *                     github:
 *                       type: string
 *                       example: "https://github.com/andres18160"
 *                     message:
 *                       type: string
 *                       example: "Desarrollador de esta API REST para gestión médica"
 *       500:
 *         description: Error interno del servidor
 */
router.get("/developer", getDeveloperInfoValidation, getDeveloperInfo);

module.exports = router;

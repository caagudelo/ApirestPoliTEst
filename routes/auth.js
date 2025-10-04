const express = require("express")
const router = express.Router()
const { validatorLogin,validatorRegister } =require("../validators/auth")
const { loginCtrl,registerCtrl } = require("../controllers/auth");

/**
 * http://localhost:3001/api
 * Route register new user
 * @openapi
 * /auth/register:
 *      post:
 *          tags:
 *              - auth              
 *          summary: "Register nuevo usuario"
 *          description: "Esta ruta es para registrar un nuevo usuario"
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/authRegister"
 *          responses:
 *              '201':
 *                  description: "Usuario registrado de manera correcta"
 *              '403':
 *                  description: "Error por validacion de usuario"
 */
//TODO http://localhost:3001/api/auth/register
router.post("/register",validatorRegister, registerCtrl)
/**
 * Login user
 * @openapi
 * /auth/login:
 *    post:
 *      tags:
 *        - auth
 *      summary: "Login user"
 *      description: Iniciar session a un nuevo usuario y obtener el token de sesión
 *      responses:
 *        '200':
 *          description: Retorna el objeto insertado en la coleccion.
 *        '422':
 *          description: Error de validacion.
 *      requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: "#/components/schemas/authLogin"
 *    responses:
 *      '201':
 *        description: Retorna el objeto insertado en la coleccion con stado '201'
 *      '403':
 *        description: No tiene permisos '403'
 */
//TODO http://localhost:3001/api/auth/login
router.post("/login",validatorLogin, loginCtrl)

module.exports = router;
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const dbConnectNoSql = require('./config/mongo')
const {dbConnectMySql} = require('./config/mysql')
const app = express()
const loggerStream =require("./utils/handleLogger")
const morganbody = require("morgan-body")
const ENGINE_DB =process.env.ENGINE_DB // Motor de bases de datos a utilizar 
const swaggerUI = require("swagger-ui-express")
const openApiConfigration = require("./docs/swagger")

app.use(cors())
app.use(express.json())
// Eliminado middleware de archivos estáticos de la carpeta 'storage' porque la funcionalidad de almacenamiento fue removida.
// Si necesitas servir otros recursos estáticos en el futuro, usa: app.use(express.static("public")) y crea una carpeta 'public'.




morganbody(app,{
    noColors:true,
    stream:loggerStream,
    skip:function(req,res){
        return res.statusCode < 400// TODO omite todos los errores inferires a codigo 400
    }
})
const port = process.env.PORT || 3000

/**
 * Definir ruta de documentacion
 */
app.use('/documentacion',swaggerUI.serve,swaggerUI.setup(openApiConfigration))
/**
 * Aqui invocamos a la ruta! 🫡
 */
//TODO localhost/api/___
app.use("/api",require("./routes")); // Carga dinámicamente las rutas activas

// Middleware de manejo de errores global
app.use((error, req, res, next) => {
    console.log("🚨 Error global capturado:", error.message);
    if(res.headersSent){
        console.log("⚠️ Respuesta ya enviada, cerrando conexión");
        return next(error);
    }
    res.status(500).json({error: "Error interno del servidor"});
});


module.exports = app;

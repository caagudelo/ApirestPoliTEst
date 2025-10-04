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
app.use(express.static("storage"))//Configuracion de recursos publicos




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
app.use("/api",require("./routes"));//TODO hace referencia al index.js de la carpeta routes

app.listen(port, () =>{
    console.log('Tu app esta lista por http://localhost:'+port)
});

(ENGINE_DB === 'nosql') ? dbConnectNoSql() : dbConnectMySql();

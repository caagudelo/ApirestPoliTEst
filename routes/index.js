const express = require("express")
const router = express.Router();
const fs = require("fs");
const PATH_ROUTES = __dirname;

const files =fs.readdirSync(PATH_ROUTES)
console.log("ARCHIVOS DE ROUTES:",{files})

const removeExtension = (fileName) =>{
    //TODO tracks.js [tracks, js]
    return fileName.split('.').shift() //TODO obtenemos solo el nombre del archivo sin la extencion
}

fs.readdirSync(PATH_ROUTES).filter((file) =>{
    const name = removeExtension(file)//TODO index, tracks
    if(name !== 'index'){
        console.log("Cargando Ruta:",name)
        router.use(`/${name}`,require(`./${file}`)) 
    }
}) 


module.exports = router
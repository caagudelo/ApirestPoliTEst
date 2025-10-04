const { storageModel } = require("../models")
const { matchedData } = require("express-validator");
const PUBLIC_URL =process.env.PUBLIC_URL;
const MEDIA_PATH =`${__dirname}/../storage`;
const fs = require("fs")
const { handleHttpError } = require("../utils/handleError");
const handleRecognizeDocument =require("../utils/handleRecognizeDocument")
const path = require("path");
const pathStorage =`${__dirname}/../storage`;
/**
 * Obtener lista de la base de datos
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    try {       
        const data = await storageModel.find({});
        res.send({data})
    } catch (e) {
        handleHttpError(res,"ERROR_EN_GET_ITEMS: "+e);
    }   
}

/**
 * Obtener un detalle de la base de datos
 * @param {*} req 
 * @param {*} res 
 */
const getItem = async (req, res) =>{
    try {
        req = matchedData(req);
        const {id} =req;      
        const data = await storageModel.findById(id);
        res.send({data})
     } catch (e) {
         handleHttpError(res,"ERROR_EN_GET_ITEM: "+e);
     }
}

/**
 * Inserta un registro
 * @param {*} req 
 * @param {*} res 
 */
const createItem = async (req, res) =>{
    try {
        const { body,file } = req;
        console.log(file);

        const documentImagePath = path.join(pathStorage,file.filename);
        handleRecognizeDocument(documentImagePath)
        .then(text => {
            // Aquí puedes realizar análisis del texto extraído para determinar el tipo de documento.
            console.log("Texto extraído del documento:");
            console.log(text);
        })
        .catch(error => {
            console.error("Error durante el reconocimiento del documento:", error);
        });

        const fileData ={
            filename: file.filename,
            url:`${PUBLIC_URL}/${file.filename}`
        }
        const data = await storageModel.create(fileData)
        res.send({data})
    } catch (error) {
        handleHttpError(res,"ERROR_EN_CREATE_ITEM: "+error);
    }
}

/**
 * Eliminar un registro
 * @param {*} req 
 * @param {*} res 
 */
const deleteItem = async (req, res) =>{
    try {
        const {id} = matchedData(req);

       const dataFile = await storageModel.findById(id);
       const {filename} =dataFile;
       const filepath = `${MEDIA_PATH}/${filename}`

       fs.unlinkSync(filepath)
       const data = await storageModel.deleteOne({_id:id});//deleteOne Realiza un borrado Fisico del registro
       //const data = await storageModel.delete({_id:id});//delete Realiza un borrado LOGICO del registro
       const dataRes ={
        filepath,
        delete:1
       }
       res.send({dataRes})
    } catch (e) {
        console.log(e)
        handleHttpError(res,"ERROR_EN_DELETE_ITEM: "+e);
    }
}

module.exports = { getItems,getItem,createItem,deleteItem };
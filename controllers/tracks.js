const { matchedData } = require("express-validator");
const { tracksModel } = require("../models")
const { handleHttpError } = require("../utils/handleError");

/**
 * Obtener lista de la base de datos
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {

    try {       
        const data = await tracksModel.findAllData({});
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
       const data = await tracksModel.findOneData(id);
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
        const  body  = matchedData(req); //  matchedData(req) Limpia los datos inencesarios que se enviand en el request y solo deja los solicitados por el modelo
       // console.log(body)
        const data = await tracksModel.create(body)
        res.send({data})
    } catch (e) {
        handleHttpError(res,"ERROR_EN_CREATE_ITEM : "+e);
    }
   
}

/**
 * Actualiza un registro
 * @param {*} req 
 * @param {*} res 
 */
const updateItem = async (req, res) =>{
    try {
        const {id, ...body} = matchedData(req); //  matchedData(req) Limpia los datos inencesarios que se enviand en el request y solo deja los solicitados por el modelo
        // console.log(body)
         const data = await tracksModel.findByIdAndUpdate(
            id, body, 
            { update: true }
         )
         res.send({data})
    } catch (e) {
        handleHttpError(res,"ERROR_EN_UPDATE_ITEM : "+e);
    }
}

/**
 * Eliminar un registro
 * @param {*} req 
 * @param {*} res 
 */
const deleteItem = async (req, res) =>{
    try {
        req = matchedData(req);
       const {id} =req;
       //const data = await tracksModel.deleteOne({_id:id});//deleteOne Realiza un borrado Fisico del registro
       const data = await tracksModel.delete({_id:id});//delete Realiza un borrado LOGICO del registro
       res.send({data})
    } catch (e) {
        console.log(e)
        handleHttpError(res,"ERROR_EN_DELETE_ITEM :"+e);
    }
}

module.exports = { getItems,getItem,createItem,updateItem,deleteItem };
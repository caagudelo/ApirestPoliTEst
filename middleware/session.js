const {handleHttpError} = require("../utils/handleError");
const { verifyToken } = require("../utils/handleJwt");
const { usersModel } = require("../models")
const getProperties = require("../utils/handlePropertiesEngine")
const propertiesKey = getProperties()

const authMiddleware =async (req, res, next) =>{
    try {
        // Verificar que existe el header de autorización
        if(!req.headers.authorization){
            handleHttpError(res,"NEED_TOKEN",401)
            return
        }

        // Extraer el token del header
        const token = req.headers.authorization.split(' ').pop(); //TODO ['Bearer', 'ddf434rf43f4f3f43f3f43f']
        
        // Verificar que el token sea válido
        const dataToken = await verifyToken(token)
        if(!dataToken){
            handleHttpError(res,"NOT_PAYLOAD_DATA",401);
            return;
        }

        // Buscar el usuario en la base de datos
        const query = {
            [propertiesKey.id]:dataToken[propertiesKey.id]
        }

        const user = await usersModel.findOne(query)
        if(!user){
            handleHttpError(res,"USER_NOT_FOUND",401);
            return;
        }

        // Agregar el usuario a la request
        req.user = user
        next();

    } catch (error) {
        console.log("❌ Error en authMiddleware:", error.message)
        handleHttpError(res,"NOT_SESSION",401)
    }
}

module.exports = authMiddleware
const {handleHttpError} = require("../utils/handleError");
const { verifyToken } = require("../utils/handleJwt");
const { usersModel } = require("../models")
const getProperties = require("../utils/handlePropertiesEngine")
const propertiesKey = getProperties()

const authMiddleware =async (req, res, next) =>{
    try {
        console.log("headers:",req)
        if(!req.headers.authorization){
            handleHttpError(res,"NEED_TOKEN",401)
            return
        }

        const token = req.headers.authorization.split(' ').pop(); //TODO ['Bearer', 'ddf434rf43f4f3f43f3f43f']
        const dataToken = await verifyToken(token)

        if(!dataToken){
            handleHttpError(res,"NOT_PAYLOAD_DATA",401);
        }

        const query = {
            [propertiesKey.id]:dataToken[propertiesKey.id]
        }

        const user = await usersModel.findOne(query)
        req.user = user

        next();

    } catch (error) {
        handleHttpError(res,"NOT_SESSION",401)
    }
}

module.exports = authMiddleware
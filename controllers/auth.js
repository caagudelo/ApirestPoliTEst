
const { matchedData, check } = require("express-validator");
const { encrypt,compare } = require("../utils/handlePassword")
const {tokenSign} = require("../utils/handleJwt")
const {usersModel} = require("../models")
const { handleHttpError } = require("../utils/handleError");

/**
 * Encargado de registrar un usuario
 * @param {*} req 
 * @param {*} res 
 */
const registerCtrl = async (req,res) =>{
    try {
        req = matchedData(req);
        const passwordHash = await encrypt(req.password)
        const body = {...req,password:passwordHash}
        const dataUser = await usersModel.create(body)
        dataUser.set('password',undefined,{strict:false});
    
        const data = {
            token:await tokenSign(dataUser),
            user:dataUser
        }
        res.status(201)
        res.send({data})
    } catch (error) {
        handleHttpError(res,"ERROR_EN_REGISTER: "+error);
    }
}

/**
 * Encargado de Login de usuario
 * @param {*} req 
 * @param {*} res 
 */
const loginCtrl = async (req,res) =>{
    try {
      req = matchedData(req);
      const user = await usersModel.findOne({email:req.email});
      
      if(!user){
        handleHttpError(res,"USER_NOT_EXISTS",404);
        return
      }

      const hashPassword = user.get("password");
      const check = await compare(req.password,hashPassword)

      if(!check){
        handleHttpError(res,"PASSWORD_INVALID",401);
        return
      }

      user.set('password',undefined,{strict:false})// para no mostrar el password en la respuesta

      const data ={
        token:await tokenSign(user),
        user:user
      }

      res.send({data})

    } catch (error) {
        console.log(error)
        handleHttpError(res,"ERROR_EN_LOGIN");
    }
}


module.exports = { loginCtrl,registerCtrl }
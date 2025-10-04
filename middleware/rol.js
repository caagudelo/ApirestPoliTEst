const { handleHttpError } = require("../utils/handleError");



/**
 * Array con los roles permitidos
 * @param {*} rol 
 * @returns 
 */
const checkRol =(rol) =>(req, res, next) =>{
   try {
    const {user} = req;
    //console.log(user)
    const rolesByUser = user.role;

    // Validamos (True,False) si la lista de roles del usuario tiene el rol solicitado por la ruta
    const checkValueRol = rol.some((rolSingle) => rolesByUser.includes(rolSingle))

    if(!checkValueRol){
        handleHttpError(res,"USER_NOT_PERMISSIONS",403)
        return
    }

    next()
   } catch (error) {
        handleHttpError(res,"ERROR_PERMISSIONS",403)
   }
}

module.exports = checkRol;

const handleHttpError = (res, message ='Algo sucedio', code =403)=>{
    // Verificar que la respuesta no se haya enviado ya
    if(res.headersSent){
        console.log("⚠️ Respuesta ya enviada, no se puede enviar error:", message);
        return;
    }
    
    res.status(code);
    res.send({error:message});
}

module.exports ={ handleHttpError }
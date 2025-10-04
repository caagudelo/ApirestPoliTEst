const {IncomingWebhook} = require('@slack/webhook')

// Solo crear webhook si la variable de entorno está configurada
let webHook = null;
if(process.env.SLACK_WEBHOOK){
    try {
        webHook = new IncomingWebhook(process.env.SLACK_WEBHOOK)
    } catch (error) {
        console.log("⚠️ Error configurando Slack webhook:", error.message)
    }
}

const loggerStream ={
    write:message =>{
        if(webHook){
            webHook.send({
                text: message
            }).catch(error => {
                console.log("⚠️ Error enviando a Slack:", error.message)
                // Fallback: mostrar en consola si Slack falla
                console.log('📝 Log (Slack falló):', message)
            })
        } else {
            // Si no hay webhook configurado, solo mostrar en consola
            console.log('📝 Log:', message)
        }
    },
};

module.exports = loggerStream
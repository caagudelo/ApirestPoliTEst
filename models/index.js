const ENGINE_DB = process.env.ENGINE_DB;

const pathModels = (ENGINE_DB === 'nosql') ? './nosql' : './mySql';

const models ={
    usersModel: require(`${pathModels}/users`),
    tracksModel: require(`${pathModels}/tracks`),
    storageModel: require(`${pathModels}/storage`),
    citasModel: require(`${pathModels}/citas`),
    pacientesModel: require(`${pathModels}/pacientes`),
    historiaClinicaModel: require(`${pathModels}/historiaClinica`),
}

module.exports = models
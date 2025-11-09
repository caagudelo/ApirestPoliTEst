const ENGINE_DB = process.env.ENGINE_DB;

const pathModels = (ENGINE_DB === 'nosql') ? './nosql' : './mySql';

const models ={
    usersModel: require(`${pathModels}/users`),
    citasModel: require(`${pathModels}/citas`),
    pacientesModel: require(`${pathModels}/pacientes`),
    historiaClinicaModel: require(`${pathModels}/historiaClinica`)
}

module.exports = models
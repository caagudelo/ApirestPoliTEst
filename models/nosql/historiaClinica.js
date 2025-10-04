const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete")

const HistoriaClinicaScheme = new mongoose.Schema(
    {
        paciente_id: {
            type: String,
            required: true
        },
        tipo_registro: {
            type: String,
            enum: ["diagnostico", "medicamento", "procedimiento", "nota"],
            required: true
        },
        descripcion: {
            type: String,
            required: true
        },
        fecha: {
            type: Date,
            default: Date.now
        },
        medico: {
            type: String
        },
        observaciones: {
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

HistoriaClinicaScheme.plugin(mongooseDelete, {overrideMethods:'all'})
module.exports = mongoose.model("historia_clinica", HistoriaClinicaScheme)

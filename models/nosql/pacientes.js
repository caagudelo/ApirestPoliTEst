const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete")

const PacienteScheme = new mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
            required: true
        },
        nombre: {
            type: String,
            required: true
        },
        fecha_nacimiento: {
            type: Date
        },
        telefono: {
            type: String
        },
        email: {
            type: String
        },
        direccion: {
            type: String
        },
        activo: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

PacienteScheme.plugin(mongooseDelete, {overrideMethods:'all'})
module.exports = mongoose.model("pacientes", PacienteScheme)

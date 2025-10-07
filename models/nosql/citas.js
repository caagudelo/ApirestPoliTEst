const { Schema, model } = require("mongoose");

const citasSchema = new Schema({
    paciente_id: {
        type: String,
        required: true,
        trim: true
    },
    fecha: {
        type: String,
        required: true,
        trim: true
    },
    hora: {
        type: String,
        required: true,
        trim: true
    },
    especialidad: {
        type: String,
        required: true,
        trim: true
    },
    estado: {
        type: String,
        default: "confirmada",
        trim: true
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Los métodos create, find, findById, etc. ya están disponibles nativamente en Mongoose
// No necesitamos redefinirlos ya que causan recursión infinita

module.exports = model("citas", citasSchema);

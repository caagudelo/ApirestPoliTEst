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

// Método para crear una nueva cita
citasSchema.statics.create = function(data) {
    return this.create(data);
};

// Método para encontrar todas las citas
citasSchema.statics.findAllData = function(query) {
    return this.find(query);
};

// Método para encontrar una cita por ID
citasSchema.statics.findOneData = function(id) {
    return this.findById(id);
};

// Método para actualizar una cita
citasSchema.statics.findByIdAndUpdate = function(id, data, options) {
    return this.findByIdAndUpdate(id, data, options);
};

// Método para eliminar una cita (borrado lógico)
citasSchema.statics.delete = function(query) {
    return this.findByIdAndUpdate(query._id, { estado: "cancelada" });
};

module.exports = model("citas", citasSchema);

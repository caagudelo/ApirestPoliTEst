const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/mysql");

const Citas = sequelize.define("citas", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    paciente_id: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true
    },
    fecha: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true
    },
    hora: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true
    },
    especialidad: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true
    },
    estado: {
        type: DataTypes.STRING,
        defaultValue: "confirmada",
        trim: true
    }
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    tableName: "citas"
});

// Método para crear una nueva cita
Citas.create = function(data) {
    return this.create(data);
};

// Método para encontrar todas las citas
Citas.findAllData = function(query) {
    return this.findAll({ where: query });
};

// Método para encontrar una cita por ID
Citas.findOneData = function(id) {
    return this.findByPk(id);
};

// Método para actualizar una cita
Citas.findByIdAndUpdate = function(id, data, options) {
    return this.update(data, { where: { id: id } });
};

// Método para eliminar una cita (borrado lógico)
Citas.delete = function(query) {
    return this.update({ estado: "cancelada" }, { where: { id: query.id } });
};

module.exports = Citas;

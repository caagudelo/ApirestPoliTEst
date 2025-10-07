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

// Los métodos create, findAll, findByPk, etc. ya están disponibles nativamente en Sequelize
// No necesitamos redefinirlos ya que causan recursión infinita

module.exports = Citas;

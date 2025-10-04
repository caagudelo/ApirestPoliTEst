const {DataTypes} = require("sequelize")
const { sequelize } = require("../../config/mysql")

const HistoriaClinica = sequelize.define(
    "historia_clinica",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            comment: "ID único del registro"
        },
        paciente_id: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "ID del paciente"
        },
        tipo_registro: {
            type: DataTypes.ENUM(["diagnostico", "medicamento", "procedimiento", "nota"]),
            allowNull: false,
            comment: "Tipo de registro médico"
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: "Descripción del diagnóstico, medicamento o procedimiento"
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: "Fecha del registro"
        },
        medico: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "Nombre del médico que realizó el registro"
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "Observaciones adicionales"
        }
    },
    {
        timestamps: true,
        tableName: 'historia_clinica'
    }
)

module.exports = HistoriaClinica

const {DataTypes} = require("sequelize")
const { sequelize } = require("../../config/mysql")

const Paciente = sequelize.define(
    "pacientes",
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            comment: "ID único del paciente"
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "Nombre completo del paciente"
        },
        fecha_nacimiento: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: "Fecha de nacimiento del paciente"
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "Número de teléfono del paciente"
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: "Email del paciente"
        },
        direccion: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "Dirección del paciente"
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: "Estado del paciente (activo/inactivo)"
        }
    },
    {
        timestamps: true,
        tableName: 'pacientes'
    }
)

module.exports = Paciente

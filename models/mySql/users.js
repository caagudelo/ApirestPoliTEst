const {DataTypes} = require("sequelize")
const { sequelize } = require("../../config/mysql")

const User = sequelize.define(
    "users",
    {
        name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        age:{
            type:DataTypes.NUMBER,
            allowNull:true,
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        role:{
            type:DataTypes.ENUM(["user","admin"])
        },
    },
    {
        timestamps:true,
    }
)
    


module.exports = User
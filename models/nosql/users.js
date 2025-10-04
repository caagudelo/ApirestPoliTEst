const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete")

const UserScheme = new mongoose.Schema(
    {
        name:{
            type: String
        },
        age:{
            type: Number
        },
        email:{
            type: String,
            unique:true
        },
        password:{
            type: String,
            select:true
        },
        role:{
            type: ["user","admin"],
            default:"user",
        }
    },
    {
        timestamps:true,  //TODO createdAt, updateAt
        versionKey:false
    }
    );
    UserScheme.plugin(mongooseDelete, {overrideMethods:'all'})//Habilitar para realizar eliminacion logica y no fisica en mongo
    module.exports = mongoose.model("users",UserScheme)
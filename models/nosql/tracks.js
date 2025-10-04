const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete")
const TracksScheme = new mongoose.Schema(
    {
        name:{
            type: String
        },
        algum:{
            type: Number
        },
        cover:{
            type: String,
            validate:(req) =>{
                return true;
            },
            message: "ERROR_URL",
        },
        artist:{
            name:{
                type: String
            },
            nickname:{
                type: String
            },
            nationality:{
                type: String
            },
        },
        duration:{
            start:{
                type: Number,
            },
            end:{
                type: Number,
            }
        },
        mediaId:{
            type:mongoose.Types.ObjectId,
        }
    },
    {
        timestamps:true,  //TODO createdAt, updateAt
        versionKey:false
    }
    );

    /**
     * Implementar metodo proprio con relacion a la tabla storage
     */
    TracksScheme.statics.findAllData = function (name) {
        const joinData =this.aggregate([//TODO Tracks
            {
                $lookup:{
                    from:"storages",//TODO Tracks --> storages
                    localField:"mediaId",//TODO Tracks.mediaId
                    foreignField:"_id",//TODO storages._id
                    as:"audio",//TODO Alias
                }
            },
            {
                $unwind:"$audio"
            }
        ])
        return joinData
    }

     /**
     * Implementar metodo proprio con relacion a la tabla storage para devolver por un criterio
     */
        TracksScheme.statics.findOneData = function (id) {
            const joinData =this.aggregate([//TODO Tracks
                {
                    $match:{
                        _id:new mongoose.Types.ObjectId(id),
                    },
                },
                {
                    $lookup:{
                        from:"storages",//TODO Tracks --> storages
                        localField:"mediaId",//TODO Tracks.mediaId
                        foreignField:"_id",//TODO storages._id
                        as:"audio",//TODO Alias
                    }
                },
                {
                    $unwind:"$audio"
                }
              
            ])
            return joinData
        }

    TracksScheme.plugin(mongooseDelete, {overrideMethods:'all'})//Habilitar para realizar eliminacion logica y no fisica en mongo

    module.exports = mongoose.model("tracks",TracksScheme)
const mongoose = require('mongoose')
const { array } = require('../middlewares/upload')

const postSchema = new mongoose.Schema({
    imagesUrl:{ type: Array , required:true },
    locationType: {type:String, required:true},
    surface: {type:Number, required:true},
    piecesNbre: {type:String, required:true},
    meuble: {type:String, required:true},
    climatisation:{type:String, required:true},
    description:{ type:String, required:true },
    governate:{type:String, required:true},
    code:{type:String, required:true},
    city:{type:String, required:true},
    location:{ type:String , required : true },
    price:{ type : String , required : true },
    comments : { type : Array },
    user_id : {type: mongoose.Schema.Types.ObjectId},
    contact : {type:Number,required:true}
})

module.exports = new mongoose.model('post', postSchema)
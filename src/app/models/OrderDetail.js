const mongoose=require("mongoose");
const slug=require('mongoose-slug-generator');
const Schema=mongoose.Schema;

const Product=new Schema({
    productName:{type:String,maxLength:255},
    price:{type:Number},
    size:{type:String,maxLength:255},
    icePercent:{type:String,maxLength:255},
    sugarPercent:{type:String,maxLength:255},
    extra:{type:String, slug:'name'},
    cost:{type:Number},
    total:{type:Number}
})

module.exports=mongoose.model('orderDetails',OrderDetail);
const mongoose=require("mongoose");
const slug=require('mongoose-slug-generator');
const Schema=mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

mongoose.plugin(slug);

const Product=new Schema({
    name:{type:String,maxLength:255},
    price:{type:Number},
    type:{type:String,maxLength:255},
    image:{type:String,maxLength:255},
    slug:{type:String, slug:'name'},
},{
    timestamps:true,
});

Product.plugin(mongooseDelete,{
    deleteAt: true,
    overrideMethods:'all',});


module.exports=mongoose.model('products',Product);
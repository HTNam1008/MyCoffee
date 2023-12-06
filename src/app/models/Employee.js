const mongoose=require("mongoose");
//const slug=require('mongoose-slug-generator');
const Schema=mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

//mongoose.plugin(slug);

const Employee=new Schema({
    name:{type:String,maxLength:255},
    email:{type:String,maxLength:255},
    sdt:{type:String,maxLength:255},
    username:{type:String,maxLength:255},
    password:{type:String,maxLength:255},
},{
    timestamps:true,
});

Employee.plugin(mongooseDelete,{
    deleteAt: true,
    overrideMethods:'all',});


module.exports=mongoose.model('Employee',Employee);
const mongoose=require("mongoose");
//const slug=require('mongoose-slug-generator');
const Schema=mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

//mongoose.plugin(slug);

const Order=new Schema({
    stt:{type: Number},
    date:{type:Date},
    item:{type:String,maxLength:255},
    vat:{type: Number},
    discount:{type:Number},
    amount:{type:Number},
    customer:{type:String,maxLength:255},
},{
    timestamps:true,
});

Order.plugin(mongooseDelete,{
    deleteAt: true,
    overrideMethods:'all',});


module.exports=mongoose.model('orders',Order);


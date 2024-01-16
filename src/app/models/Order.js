const mongoose=require("mongoose");
//const slug=require('mongoose-slug-generator');
const Schema=mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

//mongoose.plugin(slug);

const Order=new Schema({
    tableId:{type: Number},
    itemList: [{type: mongoose.Schema.Types.ObjectId, ref: 'orderDetail'}],
    discount:{type:Number},
    amount:{type:Number},
    total:{type:Number},
    note:{type:String},
    status:{type:String},
    employee:{type:String,maxLength:255},
    createdAt:{type:Date},
},{
    timestamps:true,
});

Order.plugin(mongooseDelete,{
    deleteAt: true,
    overrideMethods:'all',});


module.exports=mongoose.model('orders',Order);


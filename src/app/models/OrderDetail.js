const mongoose=require("mongoose");
//const slug=require('mongoose-slug-generator');
const Schema=mongoose.Schema;
const mongooseDelete = require('mongoose-delete');


const OrderDetail = new Schema({
    id: {type: String, maxLength: 255},
    productId: {type: String, maxLength: 255},
    productName: {type: String, maxLength: 255},
    tableId: {type: Number},
    price: {type: Number},
    size: {type: String},
    icePercent: {type: String},
    sugarPercent: {type: String},
    extra: {type: Array},
    amount: {type: Number},
    quantity: {type: Number},
    total: {type: Number},
    isOrdered: {type:Boolean}
},{
    timestamps:true,
});

OrderDetail.plugin(mongooseDelete,{
    deleteAt: true,
    overrideMethods:'all',});


module.exports=mongoose.model('orderDetail',OrderDetail);
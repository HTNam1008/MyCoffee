const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const Table = new Schema({
    noOfTable: {type: Number},
});

module.exports=mongoose.model('table',Table);

const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const Table = new Schema({
    noOfTable: {type: Number},
    orderIDs: {type: Array},
});

module.exports=mongoose.model('table',Table);

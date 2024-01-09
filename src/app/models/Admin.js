const mongoose=require("mongoose");

//const slug=require('mongoose-slug-generator');
const Schema=mongoose.Schema;

const Admin = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });

module.exports=mongoose.model('admins',Admin);

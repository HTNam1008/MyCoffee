const Product=require("../models/Product");
const {mutipleMongooseToObject}=require('../../util/mongoose');

class HomeController{
    index(req,res,next){
        Product.find({})
        .then(products=>{ 
            res.render('home',{
                products:mutipleMongooseToObject(products)});
        })
        .catch(next); 
    }
}

module.exports=new HomeController();
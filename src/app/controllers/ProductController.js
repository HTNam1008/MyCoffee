const Product=require("../models/Product");
const {mongoosesToObject}=require('../../util/mongoose');

class ProductController{
    show(req,res,next){
        Product.findOne({slug: req.params.slug})
           .then ((product)=>{
             res.render('products/show',{product:mongoosesToObject(product)})
              
           })
           .catch(next);
    }
}

module.exports=new ProductController;
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
    
    addProduct(req,res,next){
      Product.findOne({})
      .then(products=>{ 
          res.render('products/addProduct',{
              products:mongoosesToObject(products)});
      })
      .catch(next); 
  }
}

module.exports=new ProductController;
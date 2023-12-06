const Product=require("../models/Product");
const slugify = require('slugify');
const {mongoosesToObject}=require('../../util/mongoose');

class ProductController{
    show(req,res,next){
      Product.findOne({slug: req.params.slug})
      .then(product=>{ 
          res.render('products/showProduct',{
              product:mongoosesToObject(product)});
      })
      .catch(next); 
    }
    
    addProduct(req,res,next){
      res.render('products/addProduct')
    }
    // store(req,res,next){
    //   console.log(req.body);
    //   const formData=req.body;
    //   const newProduct=new Product(formData);
    //   newProduct
    //     .save()
    //     .then(()=>res.redirect('/admin/showProducts'))
    //     .catch((error)=>{
    //       console.log("Error:"+error);
    //     })
    // }
    store(req, res, next) {
      const formData = req.body;
      const imagePath = '/public/image/uploads/' + req.file.filename;
      const productName = formData.name;
  
      const productSlug = slugify(productName, { lower: true });
      const newProduct = new Product({
          name: formData.name,
          price: formData.price,
          type: formData.type,
          image: imagePath, // Lưu đường dẫn file ảnh vào trường image
          slug: productSlug // Lưu slug vào trường slug
      });
  
      newProduct.save()
          .then(() => res.redirect('/admin/showProducts'))
          .catch(error => console.log("Error:" + error));
    }
    
    edit(req,res,next){

      Product.findById(req.params.id)
        .then (product => res.render('products/editProduct',{
          product: mongoosesToObject(product)
        }))
        .catch(next);
    }

    //PUT 
    update(req, res, next) {
      const formData = req.body;
      const imagePath = '/public/image/uploads/' + req.file.filename;
      const productName = formData.name;
      const productSlug = slugify(productName, { lower: true });
  
      // Tạo một đối tượng chứa thông tin cần cập nhật
      const updatedProduct = {
          name: formData.name,
          price: formData.price,
          type: formData.type,
          image: imagePath, // Cập nhật đường dẫn file ảnh
          slug: productSlug // Cập nhật slug
      };
  
      Product.findByIdAndUpdate(req.params.id, updatedProduct, { new: true })
          .then((product) => {
              if (!product) {
                  // Xử lý trường hợp không tìm thấy sản phẩm
                  return res.status(404).send('Product not found');
              }
              
              res.redirect('/admin/showProducts');
          })
          .catch((error) => {
              console.log('Error:' + error);
              next(error);
          });

          
  }
  

    destroy(req,res,next){
        Product.deleteOne({_id:req.params.id})
          .then(()=>res.redirect('back'))
          .catch(next)
    }

}

module.exports=new ProductController;
const Product=require("../models/Product");
const slugify = require('slugify');
const {mongoosesToObject}=require('../../util/mongoose');
const OrderDetail = require("../models/OrderDetail")

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

      console.log(req.params.id);
  
      Product.findByIdAndUpdate(req.params.id, updatedProduct, { new: true })
          .then((product) => {
              if (!product) {
                  // Xử lý trường hợp không tìm thấy sản phẩm
                  return res.status(404).send('Product not diof');
              }
              
              res.redirect('/admin/showProducts');
          })
          .catch((error) => {
              console.log('Error:' + error);
              next(error);
          });

          
    }

    addToCart(req, res, next){
      const formData = req.body;
      var currenrOrders=[];
      if (req.cookies.orders){
        currenrOrders=req.cookies.orders;
      }
      Product.findOne({ slug: req.params.slug })
          .then(product => {
              if (product) {
                  // Assuming 'price' is a property of the product object
                  const productPrice = product.price;
                  const newOrder = new OrderDetail({
                    productId:product._id,
                    productName: product.name,
                    tableId: req.cookies.tableID,
                    price: productPrice,
                    size: formData.size,
                    icePercent: formData.ice, 
                    sugarPercent: formData.sugar,
                    extra: formData.topping,
                    amount: productPrice,
                    quantity: formData.quantity,
                    total : productPrice,
                    isOrdered: false,
                  });
                  for (const extra of newOrder.extra)
                  {
                    if (extra == "tranchau")
                    {
                       newOrder.amount += 8000;
                    }
                    if (extra == "banhplan")
                    {
                       newOrder.amount += 7000;
                    }
                    if (extra == "thach")
                    {
                       newOrder.amount += 5000;
                    }
                  }
                  newOrder.total = newOrder.amount*newOrder.quantity;
                  currenrOrders.push(newOrder._id);
                  res.cookie('orders',currenrOrders,{maxAge:86400000, httpOnly:true });
                  newOrder.save()
                      .then(() => {
                      // Assuming you have access to the session information
                      if (req.session && req.session.user) {
                          // Check the user type and redirect accordingly
                          if (req.session.user.role === 'employee') {
                              res.redirect('/employees/homepage');
                          } else if (req.session.user.role=== 'admin') {
                              res.redirect('/admin/homepage');
                          } else {
                              // Handle other user types if needed
                              res.redirect('/');
                          }
                      } else {
                          // If session is null, redirect to '/'
                          res.redirect('/');
                      }
                      })
                      .catch(error => console.log("Error:" + error));

                  
              } else {
                  res.status(404).send('Product not found');
              }
          })
    }

    
  

    destroy(req,res,next){
        Product.deleteOne({_id:req.params.id})
          .then(()=>res.redirect('back'))
          .catch(next)
    }

}

module.exports=new ProductController;
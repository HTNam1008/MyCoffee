const Product=require("../models/Product");
const OrderDetail=require("../models/OrderDetail");
const Order=require("../models/Order")
const slugify = require('slugify');
const {mongoosesToObject}=require('../../util/mongoose');
const {mutipleMongooseToObject}=require('../../util/mongoose');

class CartController{
    show(req,res,next){
        OrderDetail.find({tableId: req.session.tableID, isOrdered: false})
        .then(orders=>{ 
            req.session.orders=orders;
            var totalCost=0;
            for (var obj of orders){
                totalCost+=obj.total;
            }
            res.render('cart/show',{orders:mutipleMongooseToObject(orders), total: totalCost, discount: 0})
        })
        .catch(next); 
    }

    order(req,res,next){
        const formData=req.body;
        const itemList=req.session.orders;
        var itemIds=[];
        for (var obj of itemList){
            itemIds.push(obj._id);
            OrderDetail.findById(obj._id)
            .then (order => {
                  order.isOrdered=true;
                  return order.save();
            })
            .then (updatedOrder => {       
            })
            .catch();
        }
        const newOrder = new Order({
            tableId: req.session.tableID,
            itemList: itemIds,
            amount: formData.total,
            discount: formData.discount, 
            total: formData.totalCost,
            note: formData.note,
            status: "waiting",
            employee: ""
          });
    

        newOrder.save()
        //   .then(()=>{
        //     for (var obj of itemList){
        //         console.log(obj._id);
        //         OrderDetail.deleteOne({_id:obj._id})
        //         .then()
        //         .catch(next)
        //     }
        //   })
          .then((order) => {
            req.session.yourOrder=mongoosesToObject(order);
            res.redirect('/cart/order/wait')
          })
          .catch(error => console.log("Error:" + error));
       
    }

    edit(req,res,next){

        OrderDetail.findById(req.params.id)
           .then (order => {
                Product.findById(order.productId)
                  .then (product => res.render('cart/editOrder',{
                          product: mongoosesToObject(product), order: mongoosesToObject(order)
                       }))
                  .catch(next);
           })
           .catch(next);
    }

    update(req,res,next){
        const formData = req.body;
        OrderDetail.findById(req.params.id)
           .then (order => {
                Product.findById(order.productId)
                  .then (product =>{
                     var productPrice = product.price;
                     var size=formData.size;
                     var icePercent=formData.ice;
                     var sugarPercent=formData.sugar;
                     const extra=formData.topping;
                     var amount=productPrice;
                     var quantity=formData.quantity;
                     for (const i of extra)
                     {
  
                    if (i == "tranchau")
                    {
                        
                       amount += 8000;
                    }
                    if (i == "banhplan")
                    {
                       amount += 7000;
                    }
                    if (i == "thach")
                    {
                       amount += 5000;
                    }
                   }
                   var total = amount*quantity;
                   const temp={size,icePercent,sugarPercent,extra,amount,quantity,total}
                   OrderDetail.updateOne({_id:req.params.id},temp)
                   .then(()=>res.redirect('/cart/show'))
                   .catch(next);
           })
           .catch(next);
    })
    }

    destroy(req,res,next){
        OrderDetail.delete({_id:req.params.id})
           .then(()=>res.redirect('back'))
           .catch(next)
    }
 
}



module.exports=new CartController;
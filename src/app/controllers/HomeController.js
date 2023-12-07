const Product=require("../models/Product");
const Feedback=require("../models/Feedback");
const {mutipleMongooseToObject}=require('../../util/mongoose');

class HomeController{
    
    index(req,res,next){
        const user=req.session.user;
        Product.find({})
        .then(products=>{ 
            res.render('home',{
                products:mutipleMongooseToObject(products), user:user});
        })
        .catch(next); 
    }

    storeFeedback(req, res, next) {
        // const imagePath = '/public/image/uploads/' + req.file.filename;

        const feedback = new Feedback({
            name: req.body.name,
            phone: req.body.phone,
            feedback: req.body.feedback,
            // image: imagePath, // Lưu đường dẫn file ảnh vào trường image
        });

        console.log(feedback);

        // feedback.save()
        //     .then(() => res.redirect('/admin/showProducts'))
        //     .catch(error => console.log("Error:" + error));
    }
}

module.exports=new HomeController();
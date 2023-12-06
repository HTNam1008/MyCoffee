const express=require('express');
const route=express.Router();
const multer = require('multer');
const path = require('path');



const courseController=require('../app/controllers/ProductController');
const ProductController = require('../app/controllers/ProductController');


route.get('/addProduct',ProductController.addProduct);
route.get('/:slug',ProductController.show);
route.get('/:id/editProduct',ProductController.edit);
route.delete('/:id',ProductController.destroy);

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Đặt đường dẫn lưu trữ tệp ở đây
        cb(null, 'src/public/image/uploads')
    },
    filename: function(req, file, cb) {
        // Xử lý tên file tại đây
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Sử dụng middleware upload.single('image') trong route POST '/store'
route.post('/store', upload.single('image'), ProductController.store);
route.post('/:id',upload.single('image'),ProductController.update);


module.exports=route;

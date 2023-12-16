const Employee=require("../models/Employee")
const Admin=require("../models/Admin");
const bcrypt = require('bcrypt');

class AccountController{
    async signout(req,res,next){
        req.session.destroy(err=>{
            if (err){
                res.json({success:false,msg:"Error logging out"});
            }
            else{
                console.log("Sign out successfully!");
                res.redirect('/');
            }
        })
    }

    signin(req,res,next){
        res.render('signin');
    }

   async check(req,res,next){
     try{
        const username=req.body.username;
        const password=req.body.password;
        const admin =await  Admin.findOne({ username: username });
        console.log(username)

        if (admin && bcrypt.compareSync(password, admin.password)) {
            req.session.user = { id: admin._id, username: admin.username, role: 'admin' };
            return res.redirect('/admin/homepageAdmin');
        }

        return res.redirect('./signin');
     }
     catch(error){
        next(error);
       }
    }

    
}

module.exports=new AccountController();
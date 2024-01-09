module.exports=function TableAuthenticatication(req,res,next){
    if (req.session && req.session.table) {
        return next();
      } else {
        return res.redirect('/');
      }
    next();
}
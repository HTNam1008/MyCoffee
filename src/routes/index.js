const homeRouter=require('./home')
const feedbackRouter=require('./feedback')
const productRouter=require('./product')
const adminRouter=require('./admin')
const employeeRouter=require('./employee')
const accountRouter=require('./account')
const cartRouter=require('./cart')


function route(app){
    app.use('/',homeRouter);
    app.use('/feedback',feedbackRouter);
    app.use('/account',accountRouter);
    app.use('/employees',employeeRouter);
    app.use('/products',productRouter)
    app.use('/admin', adminRouter);
    app.use('/cart',cartRouter);
    
}

module.exports=route;
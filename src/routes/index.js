const homeRouter=require('./home')
const productRouter=require('./product')
const adminRouter=require('./admin')
const employeeRouter=require('./employee')
const accountRouter=require('./account')


function route(app){
    app.use('/',homeRouter);
    app.use('/account',accountRouter);
    app.use('/employees',employeeRouter);
    app.use('/products',productRouter)
    app.use('/admin', adminRouter);
    
}

module.exports=route;
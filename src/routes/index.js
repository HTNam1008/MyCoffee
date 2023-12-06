const homeRouter=require('./home')
const productRouter=require('./product')
const adminRouter=require('./admin')
const employeeRouter=require('./employee')

function route(app){
    app.use('/employees',employeeRouter);
    app.use('/products',productRouter)
    app.use('/',homeRouter);
    app.use('/admin', adminRouter);
    
}

module.exports=route;
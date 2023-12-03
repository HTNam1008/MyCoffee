const homeRouter=require('./home')
const productRouter=require('./product')
const adminRouter=require('./admin')

function route(app){
    app.use('/products',productRouter)
    app.use('/',homeRouter);
    app.use('/admin', adminRouter)
}

module.exports=route;
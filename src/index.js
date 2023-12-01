const path=require('path');
const express=require ('express');
const morgan=require ('morgan');
const {engine}=require('express-handlebars');
const methodOverride=require("method-override");

const app=express();
const port=3000;


const route=require("./routes");
const db=require("./config/db");

//connect db
db.connect("MyCoffee");


app.use('/public/js',express.static(__dirname+'/public/js'));
app.use('/public/image',express.static(__dirname+'/public/image'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(methodOverride('_method'));

//Template engine
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        helpers:{
            ifEquals: function (a, b, opts) {
                if (a.toString() === b.toString()) {
                    return opts.fn(this);
                }
                return opts.inverse(this)
            }
        }
    })
);



app.set('view engine','hbs');
app.set('views',path.join(__dirname,'resource','views'));

route(app);

app.listen(port,()=>console.log(`App listening at http:://localhost:${port}`))
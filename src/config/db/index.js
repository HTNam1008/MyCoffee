const mongoose=require("mongoose");

async function connect(){
    try{
        mongoose.set("strictQuery", false);
        await mongoose.connect('mongodb+srv://bapcaiday:phamvananhthu6112003@cluster1.0gfsvz2.mongodb.net/MyCoffee?retryWrites=true&w=majority',{
        useNewUrlParser: true,
        useUnifiedTopology:true,})
        console.log('Connect successfully')
    }
    catch(error){
        console.log('Connect failure');
    }
}


module.exports={connect};
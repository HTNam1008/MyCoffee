const mongoose=require("mongoose");

async function connect(databaseName) {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(`mongodb+srv://bapcaiday:phamvananhthu6112003@cluster1.0gfsvz2.mongodb.net/${databaseName}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connection to ${databaseName} successfully`);
       
    } catch (error) {
        console.log(`Connection to ${databaseName} failed`);
    }
}

module.exports={connect};
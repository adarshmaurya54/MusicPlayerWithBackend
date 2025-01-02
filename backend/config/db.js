const mongoose = require('mongoose');

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to Mongodb Database ${mongoose.connection.host}`);
        
    }catch(err){
        console.log(`Mongodb Database Error ${err}`.bgRed.white);
        
    }
}

module.exports = connectDB;
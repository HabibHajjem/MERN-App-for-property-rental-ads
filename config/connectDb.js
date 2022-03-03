const mongoose = require('mongoose');

const connectDb = async() =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://Habib:Arsenal&123@cluster0.oyzpw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
        console.log("DB connected successfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDb
const express = require('express');
const path = require('path')
const connectDb = require('./config/connectDb');
require('dotenv').config();
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const app = express();

app.use(express.json());
app.use('/api',authRoute);
app.use('/api',postRoute)

connectDb()

//   ---------- deployment ------------------

__dirname= path.resolve() 
if (process.env.NODE_ENV === "production") {
    app.use(express.static(__dirname, "/client/build"))

    app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html" ))
    })
}
//   ---------- deployment ------------------




app.listen(process.env.PORT, console.log(`Server is running on port ${process.env.PORT}`))
const express = require('express');
const path = require('path')
const connectDb = require('./config/connectDb');
require('dotenv').config();
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/api',authRoute);
app.use('/api',postRoute)

connectDb()

//   ---------- deployment ------------------


// if (process.env.NODE_ENV === "production") {
//     app.use(express.static("client/build"))

//     app.get("*", (req,res) => {
//         res.sendFile(path.resolve(__dirname,"client", "build", "index.html" ))
//     })
// }
// else{
//     app.get("/", (req,res) => {
//         res.send("api is running....")
//     })
// }
//   ---------- deployment ------------------




app.listen(PORT, console.log(`Server is running on port ${PORT}`))
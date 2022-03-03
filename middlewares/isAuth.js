const jwt = require('jsonwebtoken')
const userSchema = require('../models/auth')

exports.isAuth = async (req,res,next) => {
    const token = req.header("Authorization");
    try {
        if(!token)
        {return res.status(200).send({errors:[{msg:"not authorized"}]})}
        const decoded = jwt.verify(token, process.env.SecretOrKey)
        const user = await userSchema.findById(decoded.id)
        req.user = user
        next()
    } catch (error) {
        res.status(500).send("error server")
    }
}
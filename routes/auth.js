const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const upload = require('../middlewares/upload')
const userSchema = require('../models/auth');
const postSchema = require('../models/post')
const { RegisterValidation, LoginValidation, editUserValidation, Validation } = require('../middlewares/register');
const { isAuth } = require('../middlewares/isAuth');
const authRoute = express.Router();



authRoute.post('/signUp', RegisterValidation, Validation, async (req,res) => {
    const {email,password} = req.body;
    try {
        const user =  new userSchema(req.body);
        const found = await userSchema.findOne({email})
        if(found)
        {return res.status(200).send({errors:[{msg:"email already exsits"}]})}

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password,salt);
        user.password = hashedPassword;

        const payload = {id:user._id}
        const token = jwt.sign(payload,process.env.SecretOrKey);

        await user.save();
        res.status(200).send({msg:"registered successfully",user,token})

    } catch (error) {
        res.status(500).send({errors:[{msg:"could not register"}]})
    }
})

authRoute.post('/signIn', LoginValidation, Validation, async (req,res) => {
    const {email,password} = req.body;
    try {
        // const user = new userSchema();
        const user = await userSchema.findOne({email})
        if(!user)
        {return res.status(400).send({errors:[{msg:"bad credentials"}]})}
        const match = await bcrypt.compare(password,user.password)
        if(!match)
        {return res.status(400).send({errors:[{msg:"bad credentials"}]})}

        const payload = {id:user._id}
        const token = await jwt.sign(payload,process.env.SecretOrKey);

        res.status(200).send({msg:"login successfully", user, token})

    } catch (error) {
        res.status(500).send({errors:[{msg:"Server error"}]})
    }
})

authRoute.get('/current', isAuth , (req,res)=>res.send(req.user))

authRoute.get('/users', isAuth, async(req,res) => {
    try {
        const users = await userSchema.find()
        if(req.user.role!="admin")
        {return res.status(400).send({msg:"you are not authorized"})}
        res.status(200).send({users})
    } catch (error) {
        res.status(500).send({msg:"could not get users"})
    }
})

authRoute.delete('/users/deleteUser/:id', isAuth, async(req,res) => {
    try {
        const {id} = req.params
        if(req.user.role!="admin")
        {return res.status(400).send({msg:"you are not authorized"})}
        await userSchema.findByIdAndDelete(id)
        await postSchema.deleteMany({user_id:id})
        res.status(200).send({msg:"user deleted successfully"})
    } catch (error) {
        res.status(500).send({msg:"could not delete user"})
    }
})

authRoute.get('/users/:id', async(req,res)=>{
    try {
        const {id} = req.params
        const user = await userSchema.findById(id)
        res.status(200).send({user})
    } catch (error) {
        console.log(error)
    }
})

authRoute.get('/listUsers/:id', isAuth, async(req,res)=>{
    try {
        let posts = []
        const {id} = req.params

        if(req.user.role!="admin")
        {return res.status(400).send({msg:"you are not authorized"})}

        const user = await userSchema.findById(id)
        for(let post of user.posts){
            try {
                const userPost = await postSchema.findById(post._id)
                userPost?posts.push(userPost):null
            } catch (error) {
                console.log(error)
            }
        }
        res.status(200).send({posts})
    } catch (error) {
        console.log(error)
    }
})

authRoute.put('/editUser' , isAuth, editUserValidation, Validation, async (req,res) => {
    try {
        const {_id} = req.user
        await userSchema.findByIdAndUpdate(_id,req.body)
        res.status(200).send({msg:'user updated successfully !'})
    } catch (error) {
        console.log(error)
    }
})

authRoute.put('/editPassword', isAuth,  editUserValidation, Validation, async (req,res) => {
    try {
        const {password,newPassword} = req.body
        const match = await bcrypt.compare(password,req.user.password)
        if(!match){
            return res.status(400).send({errors:[{msg:"bad credentials"}]})
        }
        const salt = 10;
        const hashedPassword = await bcrypt.hash(newPassword,salt);
        await userSchema.findByIdAndUpdate(req.user._id,{password:hashedPassword})
        res.status(200).send({msg:"password updated successfully"})
    } catch (error) {
        console.log(error)
    }
})



module.exports = authRoute
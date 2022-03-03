const express = require('express')
const upload = require('../middlewares/upload')
const postRoute = express.Router()
const postSchema = require('../models/post')
const userSchema = require('../models/auth')
const { isAuth } = require('../middlewares/isAuth');
const { addPostValidation, Validation } = require('../middlewares/register')

//add post
postRoute.post('/posts/addPost' , isAuth, upload.array("myImages",5),  addPostValidation, Validation,  async(req,res) => {
    try {
        let imagesUrl=Array()
        const {_id,contact} = req.user
        let posts=req.user.posts
        console.log(req.files)
        if(req.files){
            req.files.forEach(file=>imagesUrl.push(file.filename))
        }
        const post = new postSchema({imagesUrl,...req.body,user_id:_id,contact:contact})
        await post.save()
        posts.push(post)
        await userSchema.findByIdAndUpdate(_id,{posts})
        res.status(200).send({msg:"post added successfully",post})
    } catch (error) {
        res.status(500).send({msg:"could not add post"})
    }
}) 

//get posts
postRoute.get('/posts', async(req,res)=>{
    try {
        const posts = await postSchema.find()
        res.status(200).send({posts})
    } catch (error) {
        res.status(500).send({msg:"could not get posts"})
    }
})

//get post by id
postRoute.get('/posts/:id', async (req,res) => {
    try {
        const {id} = req.params
        const post = await postSchema.findById(id)
        res.status(200).send({post})
    } catch (error) {
        res.status(500).send({msg:"could not get post by id"})
    }
})

// get my posts

postRoute.get('/myPosts', isAuth, async (req,res) => {
    try {
        const posts = await postSchema.find({user_id:req.user._id})
        res.status(200).send({posts})
    } catch (error) {
        console.log(error);
    }
})

//delete post
postRoute.delete('/posts/deletePost/:id', isAuth, async(req,res)=>{
    try {
        const {id} = req.params
        
        // if(req.user.role=="user"){
        //     posts=req.user.posts
        //     posts=posts.filter(post=>post._id!=id)
        //     await userSchema.findByIdAndUpdate(req.user._id,{posts})
        // }
        // else{
        //     const post = await postSchema.findById(id)
        //     const user = await userSchema.findById(post.user_id)
        //     posts=user.posts.filter(post=>post._id!=id)
        //     await userSchema.findByIdAndUpdate(user._id,{posts})
        // }
        await postSchema.findByIdAndDelete(id)

        res.status(200).send({msg:"post deleted successfully"})
    } catch (error) {
        res.status(500).send({msg:"could not delete post"})
    }
})

postRoute.delete('/posts/deleteAll', isAuth, async(req,res)=>{
    try {
        if(req.user.role!="admin"){
            return res.status(400).send({msg:"you are not authorized"})
        }
        await postSchema.deleteMany()
        res.status(200).send({msg:"all posts deleted successfully"})
    } catch (error) {
        console.log(error);
    }
})

// edit post
postRoute.put('/posts/editPost/:id', upload.array("myImages",5), isAuth, async(req,res)=>{
    try {
        const {id} = req.params
        const {_id} = req.user
        const post = await postSchema.findById(id)
        const imagesUrl = post.imagesUrl
        if(req.files){
            req.files.forEach(file=>imagesUrl.push(file.filename))
        }
        await postSchema.findByIdAndUpdate(id,{imagesUrl,...req.body})
        // const updatedPost = await postSchema.findById(id)
        // const user = await userSchema.findById(_id)
        // const posts = user.posts.map(post=>post._id==id?post=updatedPost:post)
        // await userSchema.findByIdAndUpdate(_id,{posts})
        res.status(200).send({msg:"post updated successfully"})
    } catch (error) {
        res.status(500).send({msg:"could not update post"})
    }
})

// add comment

postRoute.put('/posts/addComment/:id', isAuth, async(req,res)=>{
    try {
        const {id} = req.params
        const {comment} = req.body
        const {firstName,lastName} = req.user

        let post = await postSchema.findById(id)
        console.log(post);
        let comments = post.comments
        comments.push({comment,firstName,lastName})
        
        const imagesUrl = post.imagesUrl       
        await postSchema.findByIdAndUpdate(id,{imagesUrl,comments})
        res.status(200).send({msg:"comment added successfully"})
    } catch (error) {
        console.log(error);
    }
})

//delete photo

postRoute.put('/posts/deletePhoto/:id', isAuth, async(req,res)=>{
    try {
        const {id} = req.params
        const {photoName} = req.body
        const post = await postSchema.findById(id)
        post.imagesUrl=post.imagesUrl.filter(imageUrl=>imageUrl!=photoName)
        await postSchema.findByIdAndUpdate(id,{imagesUrl:post.imagesUrl})
        res.status(200).send({msg:"photo deleted successfully"})
    } catch (error) {
        console.log(error);
    }
})




module.exports = postRoute
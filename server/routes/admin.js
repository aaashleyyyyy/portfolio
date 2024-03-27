const express = require('express');
const router = express.Router();
const Post = require('../models/post'); 
const User = require('../models/user'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret=process.env.jwtSecret;

//check login
const authMiddleware = (req, res, next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: "unauthorized"});
    }
    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch(error){
        return res.status(401).json({message: "unauthorized"});
    }
};

//get admin login page
router.get('/admin', async(req, res) => {
    try{
        const locals={
            title: "Admin",
            description: "Simple Blog created with NodeJs, Express, & MongoDB"
        }
        res.render('admin/index', {locals, layout: adminLayout});
    }catch(error){
        console.log(error);
    }
});
 

//check login
router.post('/admin', async(req, res) => {
    try{
        const{username, password} = req.body;
        const user = await User.findOne({username});

        if (!user) {
            return res.status(401).json({message:'Invalid Credentials'})
        }

        const isPasswordValid= await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid Credentials"})
        }

        const token = jwt.sign({userId: user.id}, jwtSecret);
        res.cookie('token', token, {httpOnly: true});

        res.redirect('/dashboard');
    }catch(error){
        console.log(error);
    }
});

//admin dashboard
router.get('/dashboard', authMiddleware, async (req,res) =>{
    try {
        const locals={
            title: "Admin",
            description: "Simple Blog created with NodeJs, Express, & MongoDB"
        }
        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        })
    } catch (error) {
        console.log(error);
    }   
    // res.render('admin/dashboard');
});


//admin create new post
router.get('/add-post', authMiddleware, async (req,res) =>{
    try {
        const locals={
            title: "Add Post",
            description: "Simple Blog created with NodeJs, Express, & MongoDB"
        }
        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            data,
            layout: adminLayout
        })
    } catch (error) {
        console.log(error);
    }   
});

//admin post new post
router.post('/add-post', authMiddleware, async (req,res) =>{
    try {
        console.log(req.body);
        res.redirect('/dashboard');
        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            });
            await Post.create(newPost);
            res.redirect('/dashboard');
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log(error);
    }   
});

//admin put edit post
router.put('/edit-post/:id', authMiddleware, async (req,res) =>{
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });
        res.redirect(`/edit-post/${req.params.id}`); 
    } catch (error) {
        console.log(error);
    }   
});

//admin get edit post
router.get('/edit-post/:id', authMiddleware, async (req,res) =>{
    try {
        const locals={
            title: "Edit Post",
            description: "Simple Blog created with NodeJs, Express, & MongoDB"
        };
        const data = await Post.findOne({_id: req.params.id});
        res.render(('admin/edit-post'), { 
            locals,
            data, 
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }    
});

//delete post
router.delete('/delete-post/:id', authMiddleware, async (req,res) =>{
   try {
    await Post.deleteOne({_id: req.params.id});
    res.redirect('/dashboard');
   } catch (error) {
        console.log(error);
   }
});

//get admin logout
router.get('/logout', (req,res) => {
    res.clearCookie('token');
    // res.json({message: 'Logout successful.'});
    res.redirect('/');
});


//admin register
// router.post('/register', async(req, res) => {
//     try{
//         const{ username, password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         try {
//             const user = await User.create({username, password:hashedPassword});
//             res.status(201).json({message:'User Created', user});
//         } catch (error) {
//             if(error.code === 11000){
//                 res.status(409).json({message:'user already in use'});
//             }
//             res.status(500).json({message:'Internal Server Error'});
//         }
//         // console.log(req.body);
//         // res.redirect('/admin');
//     }catch(error){
//         console.log(error);
//     }
// });




module.exports=router;
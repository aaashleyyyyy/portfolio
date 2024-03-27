const express = require('express');
const router = express.Router();
const Post = require('../models/post'); 

const blogLayout = '../views/layouts/blog.ejs';

//get home 
router.get('', async(req, res) => {
    try{
        res.render('/', {currentRoute: '/'});
    }
    catch(error){
        console.log(error);
    }
});

// get post 
router.get('/post/:id', async(req, res) => {
    try{
        const locals={
            title: "NodeJs Blog",
            description: "Simple Blog created with NodeJs, Express, & MongoDB"
        }
        let slug = req.params.id;
        const data = await Post.findById({_id: slug});

        res.render('post', {locals, data, currentRoute: `/post/${slug}`});
    }
    catch(error){
        console.log(error);
    }

    
});

// get search 
router.get('/search', async(req, res) => {
    try{
        const locals={
            title: "NodeJs Blog",
            description: "Simple Blog created with NodeJs, Express, & MongoDB"
        }
        let searchTerm = req.body.searchTerm;
        console.log(searchTerm);

        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        const data = await Post.find({
            $or: [
                {title: {$regex: new RegExp(searchNoSpecialChar, "i")}},
                {body: {$regex: new RegExp(searchNoSpecialChar, "i")}}
            ]
        })
        res.render("search",{
            data,
            locals
        })
    }
        catch(error){
            console.log(error);
        }
  
});
//get about
router.get('/about', async(req, res) => {
    res.render('about', {
        currentRoute: '/about'
    });
}); 
//get projects
router.get('/projects',async(req, res) => {
    res.render('projects', {
        currentRoute: '/projects'
    });
}); 

//get contact
router.get('/contact',async(req, res) => {
    res.render('contact', {
        currentRoute: '/contact'
    });
}); 

//get blog
// router.get('/blog',(req, res) => {
//     try{
//         const locals={
//             title: "NodeJs Blog",
//             description: "Simple Blog created with NodeJs, Express, & MongoDB"
//         }
//       let perPage= 10;
//       let page = req.query.page || 1;

//       const data = await Post.aggregate([{$sort:{createdAt: -1}}])
//       .skip(perPage * page-perPage)
//       .limit(perPage)
//       .exec();

//       const count = await Post.countDocuments();
//       const nextPage = parseInt(page) + 1;
//       const hasNextPage = nextPage <= Math.ceil(count/perPage);

//       res.render('blog', {
//         locals, 
//         data, 
//         current: page,
//         nextPage: hasNextPage ? nextPage: null,
//         currentRoute: ('/'),
//         layout: blogLayout
//         });
//     }
//     catch(error){
//         console.log(error);
//     }
// });   

router.get('/blog', async(req, res) => {
    // res.render('blog', layout: blogLayout)
}
    )


   
module.exports=router; 
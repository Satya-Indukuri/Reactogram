const express = require("express");
const router = express.Router();
router.use(express.json());
const mongoose = require("mongoose");
const PostModel = mongoose.model("PostModel")
const protectedRoute = require("../middleware/protectedResource");


//all users posts
router.get("/allposts", (req,res)=>{
    PostModel.find().populate("author", "_id fullName profileImg")
    .populate("comments.commentedBy", "_id fullName")
    .then((dbPosts)=>{
        res.status(200).json({posts: dbPosts});
    }).catch((error)=>{
        console.log(error);
    })
});

//all posts of logged in user
router.get("/myallposts", protectedRoute, (req,res)=>{
    PostModel.find({author: req.user._id}).populate("author", "_id fullName profileImg").then((dbPosts)=>{
        res.status(200).json({posts: dbPosts});
    }).catch((error)=>{
        console.log(error);
    })
});

router.post("/createpost",protectedRoute, (req, res)=>{
    const {description, location, image} = req.body;
    if(!description || !location || !image){
        return res.status(400).json({ error: "One or more of the mandatory fields are missing" });
    }

    req.user.password = undefined;
    const postObj = new PostModel({description: description, location: location, image: image, author: req.user});
    postObj.save().then((newPost)=>{
        res.status(201).json({post: newPost});
    }).catch((err)=>{
        console.log(err);
    })

});

// router.delete("/deletepost/:postId", protectedRoute, (req, res)=>{
//     PostModel.findOne({_id: req.params.postId}).populate("author", "_id").exec((error, postFound)=>{
//         if(error || !postFound){
//             return res.status(400).json({error: "Post does not exist"});
//         }
//         //check if the post author is same as loggedIn user, only then allow deletion.
//         if(postFound.author._id.toString() === req.user._id.toString()){
//             postFound.remove().then((data)=>{
//                 res.status(200).json({result: data});
//             }).catch((error)=>{
//                 console.log(error);
//             })
//         }
//     })
// });


//In the above request exec is given as callback function is not supported in current mongoose version so i used asynchronous function
router.delete("/deletepost/:postId", protectedRoute, async (req, res) => {
    try {
        const postFound = await PostModel.findOne({ _id: req.params.postId }).populate("author", "_id").exec();
        
        if (!postFound) {
            return res.status(400).json({ error: "Post does not exist" });
        }

        // Check if the post author is the same as the logged-in user, only then allow deletion.
        if (postFound.author._id.toString() === req.user._id.toString()) {
            // await PostModel.deleteOne({ _id: req.params.postId });
            const deletedPost = await PostModel.findOneAndDelete({ _id: req.params.postId });
            return res.status(200).json({ result: deletedPost });
            // return res.status(200).json({ result: "Post deleted successfully" });
        } else {
            return res.status(403).json({ error: "You are not authorized to delete this post" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server error" });
    }
});


// router.put("/like", protectedRoute, (req,res)=>{
//     PostModel.findById(req.body.postId, {
//         $push: { likes : req.user._id}
//     }, {
//         new: true //returns updated record. like the updates like count
//     }).populate("author", "_id fullName").exec((error, result)=>{
//         if(error){
//             return res.status(400).json({error: error});
//         }else{
//             res.json(result)
//         }
//     })
// });


//In the above request exec is given as callback function is not supported in current mongoose version so i used asynchronous function
router.put("/like", protectedRoute, async (req, res) => {
    try {
        // Find the post by ID and update the likes array
        const result = await PostModel.findByIdAndUpdate(
            req.body.postId,
            {
                $push: { likes: req.user._id }
            },
            {
                new: true // returns the updated record
            }
        ).populate("author", "_id fullName");
        
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error });
    }
});

//just changed the push to pull to remove the userId.
router.put("/unlike", protectedRoute, async (req, res) => {
    try {
        // Find the post by ID and update the likes array
        const result = await PostModel.findByIdAndUpdate(
            req.body.postId,
            {
                $pull: { likes: req.user._id }
            },
            {
                new: true // returns the updated record
            }
        ).populate("author", "_id fullName");
        
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error });
    }
});

// router.put("/comment", protectedRoute, (req, res)=>{
//     const comment = {commentText: req.body.commentText, commentedBy: req.user._id};
//     PostModel.findByIdAndUpdate(req.body.postId,{
//         $push: {comments: comment}
//     },{
//         new: true //return updates record
//     }).populate("comments.commentedBy", "_id fullName") //comment owner
//         .populate("author", "_id fullName") //post owner
//         .exec((error, result)=>{
//             if(error){
//                 return res.status(400).json({error: error});
//             }else{
//                 res.json(result);
//             }
//         })
// })


//In the above request exec is given as callback function is not supported in current mongoose version so i used asynchronous function
router.put("/comment", protectedRoute, async (req, res) => {
    const comment = { commentText: req.body.commentText, commentedBy: req.user._id };

    try {
        const result = await PostModel.findByIdAndUpdate(
            req.body.postId,
            { $push: { comments: comment } },
            { new: true }
        )
        .populate("comments.commentedBy", "_id fullName") //comment owner
        .populate("author", "_id fullName") //post owner
        .exec();

        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error });
    }
});
module.exports = router;
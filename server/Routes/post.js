const express = require("express");
const Post = require("../Models/Post");
const User = require("../Models/User")
const router = express.Router();

// create post
router.post("/", async(req, res) => {
    try {
        const { id } = req.params;
        const postData = req.body;
        const post = await Post.create(postData);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// update post
router.put("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const post = await Post.findById({ _id: id });
        if (!post) {
            res.status(403).json({
                message: "post not found",
            });
        }

        if (post.userId === data.userId) {
            await Post.updateOne({ $set: data });
            res.status(200).json({
                message: "the has been updated",
            });
        } else {
            res.status(403).json({
                message: "you can only update your posts",
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// delete post
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const post = await Post.findById({ _id: id });
        if (!post) {
            res.status(403).json({
                message: "post not found",
            });
        }

        if (post.userId === data.userId) {
            await Post.deleteOne();
            res.status(200).json({
                message: "the has been deleted",
            });
        } else {
            res.status(403).json({
                message: "you can only delete your posts",
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// post like and dislike

router.put('/:id/like', async(req, res) => {
    try {
        const { id } = req.params
        const data = req.body

        const post = await Post.findById({ _id: id })
        if (!post.likes.includes(data.userId)) {
            await post.updateOne({ $push: { likes: data.usreId } })
            res.status(200).json({ message: "the post has been liked" })
        } else {
            await post.updateOne({ $pull: { likes: data.userId } })
            res.status(200).json({ message: "the post has been liked" })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

// get post 

router.get('/:id', async(req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById({ _id: id })
        if (!post) {
            res.status(403).json({ message: "post not found" })
        }
        res.status(200).json(post)

    } catch (err) {
        res.status(500).json(err)
    }

})

// timeline post 
router.get('/timeline/:userId', async(req, res) => {
    try {
        const { userId } = req.params
        const currentUser = await User.findById({ _id: userId })
        const userPosts = await Post.find({ userId: currentUser._id })
        const freiendPosts = await Promise.all(
            currentUser.followings.map(freiendId => {
                return Post.find({ userId: freiendId })
            })
        )
        res.status(200).json(userPosts.concat(...freiendPosts))

    } catch (err) {
        res.status(500).json(err)
    }
})

// user's posts 
router.get('/profile/:username', async(req, res) => {
    try {
        const { username } = req.params
        const user = await User.findOne({ username: username })
        const posts = await Post.find({ userId: user._id })
        res.status(200).json(posts)

    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;
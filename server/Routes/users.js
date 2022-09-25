const express = require("express");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

// update user
router.put("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (!id) {
            res.status(400).json({
                message: "User id is missing",
            });
        }
        if (data.userId === id || data.isAmin) {
            if (data.password) {
                const salt = await bcrypt.genSalt(10);
                data.password = await bcrypt.hash(data.password, salt);
            }
        }
        const user = await User.findByIdAndUpdate(id, {
            $set: data,
        });
        res.status(201).json({
            message: "Account has been updated",
        });
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
        });
    }
});

// Delete User
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                message: "User id is missing",
            });
        }
        const user = await User.deleteOne({ _id: id });
        if (!user) {
            res.status(404).json({
                message: "User not Found",
            });
        }
        console.log(user);
        res.status(200).json({
            message: "User deleted",
        });
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
        });
    }
});

// get user by id and name 
router.get("/", async(req, res) => {
    try {
        const { userId, username } = req.query;
        if (!userId && !username) {
            res.status(400).json({
                message: "User data is missing",
            });
        }
        const user = userId ? await User.findById({ _id: userId }) : await User.findOne({ username: username })
        if (!user) {
            res.status(404).json({
                message: "User not Found",
            });
        }
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
        });
    }
});

// get friends

router.get('/friends/:userId', async(req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById({ _id: userId })

        const friends = await Promise.all(
            user.followings.map(async friendId => {
                return await User.findById({ _id: friendId })
            })
        )
        const friendList = []
        friends.map(friend => {
            const { _id, username, profilePicture } = friend
            friendList.push({ _id, username, profilePicture })
        })
        res.status(200).json(friendList)
    } catch (err) {
        res.status(500).json(err)
    }
})

// follow a user

router.put("/:id/follow", async(req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (data.userId !== id) {
            const user = await User.findById({ _id: id });
            if (!user) {
                res.status(404).json({
                    message: "User not Found",
                });
            }
            const currentUser = await User.findById({ _id: data.userId });
            if (!user.followers.includes(data.userId)) {
                await user.updateOne({ $push: { followers: data.userId } });
                await currentUser.updateOne({ $push: { followings: id } });
                res.status(200).json({
                    message: "user has been followed",
                });
            } else {
                res.status(403).json({
                    message: "you already follow this user",
                });
            }
        } else {
            res.status(403).json({
                message: "you can't follow yourself",
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
        });
    }
});

// unfollow user

router.put("/:id/unfollow", async(req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (data.userId !== id) {
            const user = await User.findById({ _id: id });
            if (!user) {
                res.status(404).json({
                    message: "User not Found",
                });
            }
            const currentUser = await User.findById({ _id: data.userId });
            if (user.followers.includes(data.userId)) {
                await user.updateOne({ $pull: { followers: data.userId } });
                await currentUser.updateOne({ $pull: { followings: id } });
                res.status(200).json({
                    message: "user has been unfollowed",
                });
            } else {
                res.status(403).json({
                    message: "you are not unfollow this user",
                });
            }
        } else {
            res.status(403).json({
                message: "you can't follow yourself",
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
        });
    }
});

module.exports = router;
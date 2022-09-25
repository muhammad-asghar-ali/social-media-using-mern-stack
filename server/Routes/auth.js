const express = require("express");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/register", async(req, res) => {
    try {
        const data = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        const userDate = {
            username: data.username,
            email: data.email,
            password: hashedPassword,
            profilePicture: data.profilePicture,
            coverPicture: data.coverPicture,
            city: data.city,
            from: data.from,
            followers: data.followers,
            followings: data.followings,
            isAdmin: data.isAdmin,
            desc: data.desc,
            relationship: data.relationship
        };
        const user = await User.create(userDate);
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                message: "Email or Password is missing"
            })
        }
        const user = await User.findOne({ email: email }).lean()

        if (user) {
            const validatePassword = await bcrypt.compare(password, user.password)
            if (!validatePassword) {
                res.status(400).json({
                    message: "Wrong Password"
                })
            }
            res.status(200).json({ user });

        } else {
            res.status(404).json({
                message: "user not found"
            })
        }

    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

module.exports = router;
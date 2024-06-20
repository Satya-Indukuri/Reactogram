const express = require("express");
const router = express.Router();
router.use(express.json());
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const UserModel = mongoose.model("UserModel")
const {JWT_SECRET} = require('../config.js');


router.post("/signup", (req, res) => {
    console.log("signup touched");
    const { fullName, email, password, profileImg } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ error: "One or more of the mandatory fields are missing" });
    }
    UserModel.findOne({ email: email })
        .then((userInDB) => {
            if (userInDB) {
                return res.status(500).json({ error: "User with this email already registered" });
            }
            bcryptjs.hash(password, 16)
                .then((hashedPassword) => {
                    const user = new UserModel({ fullName, email, password: hashedPassword, profileImg });
                    user.save()
                        .then((newUser) => {
                            res.status(201).json({ result: "User Signed up Successfully!" });
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }).catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
});

router.post("/login", (req, res) => {
    console.log("login touched");
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "One or more of the mandatory fields are missing" });
    }
    UserModel.findOne({ email: email })
        .then((userInDB) => {
            if (!userInDB) {
                res.status(401).json({ error: "Invalid credentials" });
            }
            bcryptjs.compare(password, userInDB.password)
                .then((didMatch) => {
                    if(didMatch){
                        const jwtToken = jwt.sign({_id:userInDB._id}, JWT_SECRET);
                        const userInfo = { "_id": userInDB._id, "email":userInDB.email, "fullName":userInDB.fullName};

                        res.status(200).json({result:{token: jwtToken, user: userInfo}});
                    }else{
                        res.status(401).json({ error: "Invalid credentials" });
                    }
                }).catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
});

module.exports = router;
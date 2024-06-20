const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require('../config.js');

const mongoose = require("mongoose");
const UserModel = mongoose.model("UserModel");

module.exports = (req, res, next)=>{
    const {authorization} = req.headers;
    //authorization looks like = ex- Bearer bdssacsgdv (bearer +rqndom text). we only need that random text

    if(!authorization){
        return res.status(401).json({error:"User not logged in"})
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, (error, payload)=>{
        if(error){
            return res.status(401).json({error:"User not logged in"})
        }
        const {_id} = payload;
        UserModel.findById(_id).then((dbUser)=>{
            req.user = dbUser;
            next();//goes to the next middleware or the API
        }).catch(err => {
            res.status(500).json({ error: "Server error" });
        });
    })
                                                                        
}
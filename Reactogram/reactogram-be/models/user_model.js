const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profileImg:{
        type: String,
        default: 'https://unsplash.com/photos/the-sun-is-setting-over-the-water-at-the-beach-nWzaANoZ0wE'
    }
})

mongoose.model("UserModel", userSchema);
const express = require("express");
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const {MONGODB_URL} = require('./config.js');

global.__basedir = __dirname;
mongoose.connect(MONGODB_URL);

mongoose.connection.on('connected', ()=>{
    console.log('DB connection successful');
})

mongoose.connection.on('error', (error)=>{
    console.log('Some error while connecting to database');
})


require('./models/user_model.js');
require('./models/post_model.js');


app.use(cors());
app.use(express.json());


//adding the routes to the 'app'
app.use(require('./routes/user_route.js'));
app.use(require('./routes/post_route.js'));
app.use(require('./routes/file_route.js'));


app.listen(3500, ()=>{
    console.log("server stared ... ");
})
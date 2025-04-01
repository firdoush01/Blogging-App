const express = require('express');
const path = require('path');
const userRoute = require('./Routes/user')
const mongoose = require("mongoose")

const app = express();
const PORT = 8000;

mongoose.connect('mongodb+srv://mdfirdoushali1776:lsAVWwx6r1eD8eY5@cluster0.qnplb48.mongodb.net/')
.then((e)  => console.log( "MongoDB is connected" ))

app.set('view engine', 'ejs')
app.set('views', path.resolve('./Views'))

app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => {
    res.render("home");
})
app.use('/user', userRoute)

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
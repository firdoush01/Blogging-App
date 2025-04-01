const express = require('express');
const path = require('path');
const userRoute = require('./Routes/user')
const mongoose = require("mongoose")

const app = express();
const PORT = 8000;

app.set('view engine', 'ejs')
app.set('views', path.resolve('./Views'))

app.get("/", (req, res) => {
    res.render("home");
})
app.use('/user', userRoute)

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
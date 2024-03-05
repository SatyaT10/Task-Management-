const express = require('express');
const cors = require('cors');
const moment=require('moment');
const userRoute=require('./routes/userRoute');
const mongoose = require("mongoose");
const { log } = require('console');
mongoose.connect('mongodb://127.0.0.1:27017/task');
const app = express();
const http = require('http').Server(app);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api',userRoute);
//connecting to the database using mongoose


http.listen(3000, () => console.log("Server is listening on port 3000."));
